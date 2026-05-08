/**
 * SaaS Vala Enterprise - Manufacturing API
 * BoM, MO & work centers
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/manufacturing')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('manufacturing-api');
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching Manufacturing data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'kpis') {
        data.kpis = {
          openMOs: 42,
          completed: 188,
          throughput: 97,
          scrap: 0.8,
          openMOsDelta: 4,
          completedDelta: 22,
          throughputDelta: 1,
          scrapDelta: -0.2,
        };
      }

      if (type === 'all' || type === 'orders') {
        data.orders = [
          { id: 'MO-3101', product: 'Widget A', qty: 500, status: 'In Progress', startDate: new Date().toISOString() },
          { id: 'MO-3102', product: 'Gadget B', qty: 200, status: 'Planned', startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
          { id: 'MO-3103', product: 'Product C', qty: 350, status: 'Completed', startDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
        ];
      }

      logger.info('Manufacturing data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      logger.error('Failed to fetch Manufacturing data', error);

      return Response.json({ success: false, error: 'Failed to fetch Manufacturing data' }, { status: 500 });
    }
  },
});
