// @ts-nocheck
/**
 * SaaS Vala Enterprise - Notifications API
 * Real notification data
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/notifications/')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('notifications-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching notifications', { userId: auth.userId });

      // Get user's notifications
      const notifications = await prisma.notification.findMany({
        where: {
          userId: auth.userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      });

      // Count unread
      const unreadCount = await prisma.notification.count({
        where: {
          userId: auth.userId,
          readAt: null,
        },
      });

      logger.info('Notifications fetched successfully', { count: notifications.length, unreadCount });

      return new Response(
        JSON.stringify({
          notifications,
          unreadCount,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      logger.error('Failed to fetch notifications', error);

      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
});

