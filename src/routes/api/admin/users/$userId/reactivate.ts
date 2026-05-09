// @ts-nocheck
/**
 * SaaS Vala Enterprise - User Reactivation API
 * User reactivation
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/admin/users/$userId/reactivate')({
  POST: async ({ request, params }) => {
    const logger = Logger.createRequestLogger('admin-user-reactivate-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      logger.info('Reactivating user', { adminUserId: auth.userId, targetUserId: params.userId });

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
          status: 'ACTIVE',
          suspendedAt: null,
          suspendedUntil: null,
          metadata: {
            ...user.metadata,
            reactivatedBy: auth.userId,
            reactivatedAt: new Date().toISOString(),
          },
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: params.userId,
          type: 'ACCOUNT_REACTIVATED',
          title: 'Account Reactivated',
          content: 'Your account has been reactivated.',
          metadata: {},
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          userId: auth.userId,
          action: 'user.reactivated',
          entity: 'user',
          entityId: params.userId,
          metadata: {
            targetUserId: params.userId,
          },
        },
      });

      logger.info('User reactivated successfully', { userId: params.userId });

      return Response.json({ user: updatedUser });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to reactivate user', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
