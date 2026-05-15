// @ts-nocheck
/**
 * SaaS Vala Enterprise - Company Status Control API
 * Company suspension and status management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const updateCompanyStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']),
  reason: z.string().optional(),
});

export const Route = createFileRoute('/api/admin/companies/$companyId/status')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const logger = Logger.createRequestLogger('admin-company-status-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          
          if (!auth.isSuperAdmin) {
            return Response.json(
              { error: 'Unauthorized access' },
              { status: 403 }
            );
          }

          const body = await request.json();
          const validatedData = updateCompanyStatusSchema.parse(body);

          logger.info('Updating company status', { adminUserId: auth.userId, companyId: params.companyId });

          // Check if company exists
          const company = await prisma.company.findUnique({
            where: { id: params.companyId },
          });

          if (!company) {
            return Response.json(
              { error: 'Company not found' },
              { status: 404 }
            );
          }

          // Update company status
          const updatedCompany = await prisma.company.update({
            where: { id: params.companyId },
            data: {
              metadata: {
                ...company.metadata,
                status: validatedData.status,
                statusReason: validatedData.reason,
                statusUpdatedAt: new Date().toISOString(),
                statusUpdatedBy: auth.userId,
              },
            },
          });

          // Suspend all users if company is suspended
          if (validatedData.status === 'SUSPENDED' || validatedData.status === 'BANNED') {
            await prisma.user.updateMany({
              where: { companyId: params.companyId },
              data: {
                status: 'SUSPENDED',
                suspendedAt: new Date(),
                metadata: {
                  suspendedReason: `Company ${validatedData.status.toLowerCase()}: ${validatedData.reason}`,
                },
              },
            });

            // Revoke all sessions for company users
            const companyUsers = await prisma.user.findMany({
              where: { companyId: params.companyId },
              select: { id: true },
            });

            await prisma.session.updateMany({
              where: {
                userId: {
                  in: companyUsers.map((u) => u.id),
                },
              },
              data: {
                isActive: false,
                revokedAt: new Date(),
              },
            });
          }

          // Reactivate users if company is reactivated
          if (validatedData.status === 'ACTIVE') {
            await prisma.user.updateMany({
              where: { companyId: params.companyId },
              data: {
                status: 'ACTIVE',
                suspendedAt: null,
                suspendedUntil: null,
              },
            });
          }

          // Log activity
          await prisma.activity.create({
            data: {
              userId: auth.userId,
              action: 'company.status_updated',
              entity: 'company',
              entityId: params.companyId,
              metadata: {
                oldStatus: company.metadata?.status || 'ACTIVE',
                newStatus: validatedData.status,
                reason: validatedData.reason,
              },
            },
          });

          logger.info('Company status updated successfully', { companyId: params.companyId });

          return Response.json({ company: updatedCompany });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }

          if (error instanceof z.ZodError) {
            return Response.json(
              { error: 'Validation error', details: error.errors },
              { status: 400 }
            );
          }

          logger.error('Failed to update company status', error);

          return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      },
    },
  },
});
