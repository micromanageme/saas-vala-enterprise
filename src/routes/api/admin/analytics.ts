/**
 * SaaS Vala Enterprise - Enterprise Analytics API
 * Global analytics for Super Admin
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/admin/analytics')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('admin-analytics-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      const url = new URL(request.url);
      const timeRange = parseInt(url.searchParams.get('timeRange') || '30'); // days

      logger.info('Fetching enterprise analytics', { userId: auth.userId, timeRange });

      const since = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);

      // Get analytics data
      const [
        totalRevenue,
        newUsers,
        newSubscriptions,
        activeSubscriptions,
        totalDownloads,
        newProducts,
        totalVendors,
        totalAffiliates,
      ] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            type: 'CREDIT',
            status: 'COMPLETED',
            createdAt: { gte: since },
          },
          _sum: { amount: true },
        }),
        prisma.user.count({
          where: {
            createdAt: { gte: since },
          },
        }),
        prisma.subscription.count({
          where: {
            createdAt: { gte: since },
          },
        }),
        prisma.subscription.count({
          where: {
            status: 'ACTIVE',
          },
        }),
        prisma.download.count({
          where: {
            createdAt: { gte: since },
          },
        }),
        prisma.product.count({
          where: {
            createdAt: { gte: since },
          },
        }),
        prisma.reseller.count({
          where: {
            status: 'ACTIVE',
            tier: { in: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] },
          },
        }),
        prisma.affiliate.count({
          where: {
            status: 'ACTIVE',
          },
        }),
      ]);

      // Get revenue trend
      const revenueTrend = await prisma.transaction.groupBy({
        by: ['createdAt'],
        where: {
          type: 'CREDIT',
          status: 'COMPLETED',
          createdAt: { gte: since },
        },
        _sum: { amount: true },
        orderBy: { createdAt: 'asc' },
      });

      const analytics = {
        revenue: {
          total: totalRevenue._sum.amount?.toNumber() || 0,
          trend: revenueTrend.map((item) => ({
            date: new Date(item.createdAt).toISOString().split('T')[0],
            amount: item._sum.amount?.toNumber() || 0,
          })),
        },
        growth: {
          newUsers,
          newSubscriptions,
          newProducts,
        },
        marketplace: {
          activeSubscriptions,
          totalDownloads,
          totalVendors,
          totalAffiliates,
        },
      };

      logger.info('Enterprise analytics fetched successfully');

      return Response.json({ analytics });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch enterprise analytics', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
