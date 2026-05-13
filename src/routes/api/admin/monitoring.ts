// @ts-nocheck
/**
 * SaaS Vala Enterprise - Global Monitoring API
 * System-wide monitoring and observability
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { apiMonitor } from '@/lib/api-monitor';

export const Route = createFileRoute('/api/admin/monitoring')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('admin-monitoring-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      logger.info('Fetching system monitoring data', { userId: auth.userId });

      // Get system statistics
      const [
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalSessions,
        activeSessions,
        totalLicenses,
        activeLicenses,
        totalProducts,
        totalTransactions,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: 'ACTIVE' } }),
        prisma.user.count({ where: { status: 'SUSPENDED' } }),
        prisma.session.count(),
        prisma.session.count({ where: { isActive: true } }),
        prisma.license.count(),
        prisma.license.count({ where: { status: 'ACTIVE' } }),
        prisma.product.count(),
        prisma.transaction.count(),
      ]);

      // Get API metrics
      const apiMetrics = apiMonitor.getSummary(24 * 60 * 60 * 1000); // Last 24 hours

      // Get recent activities
      const recentActivities = await prisma.activity.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      });

      // Get recent errors
      const recentErrors = recentActivities.filter((a) => 
        a.action.includes('error') || a.action.includes('failed')
      );

      const monitoring = {
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
        },
        sessions: {
          total: totalSessions,
          active: activeSessions,
        },
        licenses: {
          total: totalLicenses,
          active: activeLicenses,
        },
        products: {
          total: totalProducts,
        },
        transactions: {
          total: totalTransactions,
        },
        apiMetrics,
        recentActivities: {
          total: recentActivities.length,
          errors: recentErrors.length,
        },
      };

      logger.info('Monitoring data fetched successfully');

      return Response.json({ monitoring });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch monitoring data', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
