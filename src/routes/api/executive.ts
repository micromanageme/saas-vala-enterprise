/**
 * SaaS Vala Enterprise - Executive API
 * C-suite dashboard and executive KPIs
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/executive')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('executive-api');
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching Executive data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'kpis') {
        data.kpis = {
          revenue: 4280000,
          ebitda: 1120000,
          cash: 2400000,
          nps: 62,
          revenueDelta: 14,
          ebitdaDelta: 9,
          cashDelta: 6,
          npsDelta: 4,
        };
      }

      if (type === 'all' || type === 'targets') {
        data.targets = [
          { kpi: 'Q2 Revenue', target: 4000000, actual: 4280000, status: 'On Track' },
          { kpi: 'Gross Margin', target: 42, actual: 44, status: 'Above' },
          { kpi: 'Customer Acquisition', target: 500, actual: 524, status: 'Above' },
          { kpi: 'Churn Rate', target: 3, actual: 2.4, status: 'Above' },
        ];
      }

      if (type === 'all' || type === 'trends') {
        data.trends = {
          revenue: [3800000, 3950000, 4100000, 4150000, 4200000, 4280000],
          ebitda: [980000, 1020000, 1050000, 1070000, 1100000, 1120000],
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        };
      }

      logger.info('Executive data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      logger.error('Failed to fetch Executive data', error);

      return Response.json({ success: false, error: 'Failed to fetch Executive data' }, { status: 500 });
    }
  },
});
