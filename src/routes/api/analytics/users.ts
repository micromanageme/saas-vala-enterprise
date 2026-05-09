// @ts-nocheck
/**
 * SaaS Vala Enterprise - User Behavior Analytics API
 * User behavior and engagement analytics
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/analytics/users')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('user-analytics-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching user analytics', { userId: auth.userId });

      const companyId = auth.companyId;

      // Get user statistics
      const [
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        userEngagement,
      ] = await Promise.all([
        prisma.user.count({
          where: {
            deletedAt: null,
            ...(companyId ? { companyId } : {}),
          },
        }),
        prisma.user.count({
          where: {
            deletedAt: null,
            status: 'ACTIVE',
            ...(companyId ? { companyId } : {}),
          },
        }),
        prisma.user.count({
          where: {
            deletedAt: null,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
            ...(companyId ? { companyId } : {}),
          },
        }),
        prisma.activity.groupBy({
          by: ['userId'],
          _count: true,
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: {
            _count: {
              desc: true,
            },
          },
          take: 10,
        }),
      ]);

      // Get user details for engagement
      const topUsers = await Promise.all(
        userEngagement.map(async (item) => {
          const user = await prisma.user.findUnique({
            where: { id: item.userId },
            select: {
              id: true,
              displayName: true,
              email: true,
              avatar: true,
            },
          });
          return {
            userId: item.userId,
            displayName: user?.displayName || 'Unknown',
            email: user?.email || 'Unknown',
            activities: item._count,
          };
        })
      );

      const analytics = {
        overview: {
          totalUsers,
          activeUsers,
          newUsersThisMonth,
        },
        engagement: {
          topUsers,
        },
      };

      logger.info('User analytics fetched successfully', { userId: auth.userId });

      return Response.json({ analytics });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch user analytics', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
