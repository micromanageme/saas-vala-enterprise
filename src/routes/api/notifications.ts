// @ts-nocheck
/**
 * SaaS Vala Enterprise - Notifications API
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/notifications')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('notifications-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching notifications', { userId: auth.userId });

      const notifications = await prisma.notification.findMany({
        where: {
          userId: auth.userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      });

      const unreadCount = await prisma.notification.count({
        where: {
          userId: auth.userId,
          readAt: null,
        },
      });

      logger.info('Notifications fetched successfully', { count: notifications.length, unreadCount });

      return Response.json({
        notifications,
        unreadCount,
      });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch notifications', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
