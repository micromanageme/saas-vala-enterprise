// @ts-nocheck
/**
 * SaaS Vala Enterprise - Activity Feed API
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/activity')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('activity-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          logger.info('Fetching activity feed', { userId: auth.userId });

          const companyId = auth.companyId;

          const activities = await prisma.activity.findMany({
            where: {
              ...(companyId ? { user: { companyId } } : {}),
            },
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  avatar: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 50,
          });

          logger.info('Activity feed fetched successfully', { count: activities.length });

          return Response.json({ activities });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }

          logger.error('Failed to fetch activity feed', error);

          return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      },
    },
  },
});
