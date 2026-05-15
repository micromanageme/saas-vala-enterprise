// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/notifications/mark-read')({
  server: {
    handlers: {
      POST: async ({ request }: any) => {
        const logger = Logger.createRequestLogger('notifications-api');
        try {
          const auth = await AuthMiddleware.authenticate(request);
          const { notificationId } = await request.json();
          await prisma.notification.updateMany({
            where: { id: notificationId, userId: auth.userId },
            data: { readAt: new Date() },
          });
          return new Response(JSON.stringify({ success: true }), {
            status: 200, headers: { 'Content-Type': 'application/json' },
          });
        } catch (error: any) {
          logger.error('Failed to mark notification as read', error);
          return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  },
});
