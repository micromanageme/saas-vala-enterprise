// @ts-nocheck
/**
 * SaaS Vala Enterprise - Revenue Analytics API
 * Revenue and financial analytics
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/analytics/revenue')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('revenue-analytics-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching revenue analytics', { userId: auth.userId });

      const companyId = auth.companyId;

      // Get revenue statistics
      const [
        totalRevenue,
        monthlyRevenue,
        pendingPayouts,
        completedPayouts,
        revenueTrend,
      ] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            type: 'CREDIT',
            status: 'COMPLETED',
            ...(companyId ? { user: { companyId } } : {}),
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            type: 'CREDIT',
            status: 'COMPLETED',
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
            ...(companyId ? { user: { companyId } } : {}),
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            type: 'DEBIT',
            status: 'PENDING',
            ...(companyId ? { user: { companyId } } : {}),
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            type: 'DEBIT',
            status: 'COMPLETED',
            ...(companyId ? { user: { companyId } } : {}),
          },
          _sum: { amount: true },
        }),
        prisma.transaction.groupBy({
          by: ['createdAt'],
          where: {
            type: 'CREDIT',
            status: 'COMPLETED',
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
            ...(companyId ? { user: { companyId } } : {}),
          },
          _sum: { amount: true },
          orderBy: { createdAt: 'asc' },
        }),
      ]);

      // Format revenue trend
      const trendData = revenueTrend.map((item) => ({
        date: new Date(item.createdAt).toISOString().split('T')[0],
        revenue: item._sum.amount?.toNumber() || 0,
      }));

      const analytics = {
        overview: {
          totalRevenue: totalRevenue._sum.amount?.toNumber() || 0,
          monthlyRevenue: monthlyRevenue._sum.amount?.toNumber() || 0,
          pendingPayouts: pendingPayouts._sum.amount?.toNumber() || 0,
          completedPayouts: completedPayouts._sum.amount?.toNumber() || 0,
        },
        trend: trendData,
      };

      logger.info('Revenue analytics fetched successfully', { userId: auth.userId });

      return Response.json({ analytics });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch revenue analytics', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
