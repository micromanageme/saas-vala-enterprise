/**
 * SaaS Vala Enterprise - User Suspension API
 * User suspension and reactivation
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const suspendUserSchema = z.object({
  reason: z.string(),
  suspendedUntil: z.string().optional(),
});

export const Route = createFileRoute('/api/admin/users/$userId/suspend')({
  POST: async ({ request, params }) => {
    const logger = Logger.createRequestLogger('admin-user-suspend-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      const body = await request.json();
      const validatedData = suspendUserSchema.parse(body);

      logger.info('Suspending user', { adminUserId: auth.userId, targetUserId: params.userId });

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: params.userId },
      });

      if (!user) {
        return Response.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Update user status
      const updatedUser = await prisma.user.update({
        where: { id: params.userId },
        data: {
          status: 'SUSPENDED',
          suspendedAt: new Date(),
          suspendedUntil: validatedData.suspendedUntil ? new Date(validatedData.suspendedUntil) : null,
          metadata: {
            ...user.metadata,
            suspendReason: validatedData.reason,
            suspendedBy: auth.userId,
            suspendedAt: new Date().toISOString(),
          },
        },
      });

      // Revoke all sessions
      await prisma.session.updateMany({
        where: { userId: params.userId },
        data: {
          isActive: false,
          revokedAt: new Date(),
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: params.userId,
          type: 'ACCOUNT_SUSPENDED',
          title: 'Account Suspended',
          content: `Your account has been suspended. Reason: ${validatedData.reason}`,
          metadata: {
            reason: validatedData.reason,
          },
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          userId: auth.userId,
          action: 'user.suspended',
          entity: 'user',
          entityId: params.userId,
          metadata: {
            targetUserId: params.userId,
            reason: validatedData.reason,
          },
        },
      });

      logger.info('User suspended successfully', { userId: params.userId });

      return Response.json({ user: updatedUser });
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

      logger.error('Failed to suspend user', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
