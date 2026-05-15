// @ts-nocheck
/**
 * SaaS Vala Enterprise - Reports API
 * BI reports & analytics
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/reports')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('reports-api');
        const url = new URL(request.url);
        const type = url.searchParams.get('type') || 'all';

        try {
          const auth = await AuthMiddleware.authenticate(request);
          logger.info('Fetching Reports data', { userId: auth.userId, type });

          const data: any = {};

          if (type === 'all' || type === 'kpis') {
            data.kpis = {
              totalReports: 124,
              scheduled: 48,
              subscribers: 256,
              exports: 1842,
              totalReportsDelta: 8,
              scheduledDelta: 4,
              subscribersDelta: 12,
              exportsDelta: 18,
            };
          }

          if (type === 'all' || type === 'reports') {
            data.reports = [
              { id: 'RPT-001', name: 'Monthly Sales', type: 'Financial', lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), status: 'Active', subscribers: 45 },
              { id: 'RPT-002', name: 'Customer Churn', type: 'Analytics', lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), status: 'Active', subscribers: 32 },
              { id: 'RPT-003', name: 'Inventory Status', type: 'Operations', lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), status: 'Active', subscribers: 28 },
            ];
          }

          logger.info('Reports data fetched successfully');

          return Response.json({ success: true, data });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json({ error: 'Authentication required' }, { status: 401 });
          }

          logger.error('Failed to fetch Reports data', error);

          return Response.json({ success: false, error: 'Failed to fetch Reports data' }, { status: 500 });
        }
      },
    },
  },
});
