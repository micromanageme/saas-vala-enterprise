// @ts-nocheck
/**
 * SaaS Vala Enterprise - Calendar API
 * Events, meetings & scheduling
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/calendar')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('calendar-api');
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching Calendar data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'kpis') {
        data.kpis = {
          todayEvents: 8,
          upcoming: 24,
          meetings: 12,
          conflicts: 0,
          todayEventsDelta: 2,
          upcomingDelta: 4,
          meetingsDelta: 1,
          conflictsDelta: -1,
        };
      }

      if (type === 'all' || type === 'events') {
        data.events = [
          { id: 'EVT-001', title: 'Team Standup', start: new Date().toISOString(), end: new Date(Date.now() + 30 * 60 * 1000).toISOString(), type: 'Meeting', status: 'Confirmed' },
          { id: 'EVT-002', title: 'Client Review', start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), end: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), type: 'Meeting', status: 'Confirmed' },
          { id: 'EVT-003', title: 'Product Demo', start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), end: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), type: 'Demo', status: 'Tentative' },
        ];
      }

      logger.info('Calendar data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      logger.error('Failed to fetch Calendar data', error);

      return Response.json({ success: false, error: 'Failed to fetch Calendar data' }, { status: 500 });
    }
  },
});
