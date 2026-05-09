// @ts-nocheck
/**
 * SaaS Vala Enterprise - Messaging API
 * WhatsApp, SMS & Email
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/messaging')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('messaging-api');
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching Messaging data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'kpis') {
        data.kpis = {
          sent24h: 24820,
          delivered: 99.4,
          openRate: 42,
          templates: 148,
          sent24hDelta: 8,
          deliveredDelta: 0.2,
          openRateDelta: 3,
          templatesDelta: 4,
        };
      }

      if (type === 'all' || type === 'campaigns') {
        data.campaigns = [
          { id: 'MSG-001', channel: 'WhatsApp', template: 'Order Confirmation', sent: 8420, deliveryRate: 99.6, status: 'Active' },
          { id: 'MSG-002', channel: 'Email', template: 'Invoice', sent: 12480, deliveryRate: 99.1, status: 'Active' },
          { id: 'MSG-003', channel: 'SMS', template: 'OTP', sent: 3920, deliveryRate: 98.5, status: 'Active' },
        ];
      }

      logger.info('Messaging data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      logger.error('Failed to fetch Messaging data', error);

      return Response.json({ success: false, error: 'Failed to fetch Messaging data' }, { status: 500 });
    }
  },
});
