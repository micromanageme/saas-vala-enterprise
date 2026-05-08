/**
 * SaaS Vala Enterprise - ERP API
 * Sales, Quotations, Orders & Invoicing
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/erp')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('erp-api');
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching ERP data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'kpis') {
        data.kpis = {
          quotations: 148,
          salesOrders: 97,
          invoiced: 612000,
          backorders: 12,
          quotationsDelta: 11,
          salesOrdersDelta: 6,
          invoicedDelta: 14,
          backordersDelta: -3,
        };
      }

      if (type === 'all' || type === 'orders') {
        data.orders = [
          { id: 'SO-1042', customer: 'Acme Corp', amount: 24000, status: 'Confirmed', date: new Date().toISOString() },
          { id: 'SO-1043', customer: 'Vertex Ltd', amount: 8250, status: 'Draft', date: new Date().toISOString() },
          { id: 'SO-1044', customer: 'Globex', amount: 45600, status: 'Shipped', date: new Date().toISOString() },
          { id: 'SO-1045', customer: 'Initech', amount: 32100, status: 'Delivered', date: new Date().toISOString() },
          { id: 'SO-1046', customer: 'Hooli', amount: 18900, status: 'Confirmed', date: new Date().toISOString() },
        ];
      }

      if (type === 'all' || type === 'quotations') {
        data.quotations = [
          { id: 'QT-2041', customer: 'Acme Corp', amount: 24000, status: 'Sent', validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
          { id: 'QT-2042', customer: 'Vertex Ltd', amount: 8250, status: 'Draft', validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
          { id: 'QT-2043', customer: 'Globex', amount: 45600, status: 'Accepted', validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
        ];
      }

      logger.info('ERP data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      logger.error('Failed to fetch ERP data', error);

      return Response.json({ success: false, error: 'Failed to fetch ERP data' }, { status: 500 });
    }
  },
});
