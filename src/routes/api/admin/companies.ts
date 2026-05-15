// @ts-nocheck
/**
 * SaaS Vala Enterprise - Global Company Control API
 * Super Admin company management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const createCompanySchema = z.object({
  name: z.string(),
  slug: z.string(),
  domain: z.string().optional(),
  metadata: z.any().optional(),
});

const updateCompanyStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']),
  reason: z.string().optional(),
});

export const Route = createFileRoute('/api/admin/companies')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('admin-companies-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          
          if (!auth.isSuperAdmin) {
            return Response.json(
              { error: 'Unauthorized access' },
              { status: 403 }
            );
          }

          logger.info('Fetching all companies', { userId: auth.userId });

          const companies = await prisma.company.findMany({
            include: {
              _count: {
                select: {
                  users: true,
                  workspaces: true,
                  branches: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          });

          logger.info('Companies fetched successfully', { count: companies.length });

          return Response.json({ companies });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }

          logger.error('Failed to fetch companies', error);

          return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      },

      POST: async ({ request }) => {
        const logger = Logger.createRequestLogger('admin-companies-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          
          if (!auth.isSuperAdmin) {
            return Response.json(
              { error: 'Unauthorized access' },
              { status: 403 }
            );
          }

          const body = await request.json();
          const validatedData = createCompanySchema.parse(body);

          logger.info('Creating company', { userId: auth.userId });

          const company = await prisma.company.create({
            data: {
              name: validatedData.name,
              slug: validatedData.slug,
              domain: validatedData.domain,
              metadata: validatedData.metadata || {},
            },
          });

          logger.info('Company created successfully', { companyId: company.id });

          return Response.json({ company });
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

          logger.error('Failed to create company', error);

          return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      },
    },
  },
});
