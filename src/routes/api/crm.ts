// @ts-nocheck
/**
 * SaaS Vala Enterprise - CRM API
 * Customer Relationship Management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/crm')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('crm-api');
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching CRM data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'kpis') {
        // Mock KPIs - in production, calculate from actual data
        data.kpis = {
          openLeads: 312,
          wonDeals: 842000,
          winRate: 34,
          avgCycle: 21,
          openLeadsDelta: 18,
          wonDealsDelta: 9,
          winRateDelta: 2,
          avgCycleDelta: -3,
        };
      }

      if (type === 'all' || type === 'leads') {
        // Mock leads data
        data.leads = [
          { id: '1', name: 'Acme Corp', stage: 'Qualified', value: 24000, owner: 'A. Khan', createdAt: new Date().toISOString() },
          { id: '2', name: 'Globex', stage: 'Proposal', value: 58400, owner: 'M. Patel', createdAt: new Date().toISOString() },
          { id: '3', name: 'Initech', stage: 'Negotiation', value: 112000, owner: 'R. Singh', createdAt: new Date().toISOString() },
          { id: '4', name: 'Hooli', stage: 'New', value: 45000, owner: 'A. Khan', createdAt: new Date().toISOString() },
          { id: '5', name: 'Massive Dynamic', stage: 'Qualified', value: 78000, owner: 'M. Patel', createdAt: new Date().toISOString() },
        ];
      }

      if (type === 'all' || type === 'pipeline') {
        data.pipeline = [
          { stage: 'New', count: 45, value: 890000 },
          { stage: 'Qualified', count: 38, value: 1245000 },
          { stage: 'Proposal', count: 24, value: 876000 },
          { stage: 'Negotiation', count: 18, value: 1456000 },
          { stage: 'Won', count: 52, value: 3420000 },
          { stage: 'Lost', count: 15, value: 234000 },
        ];
      }

      logger.info('CRM data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      logger.error('Failed to fetch CRM data', error);

      return Response.json({ success: false, error: 'Failed to fetch CRM data' }, { status: 500 });
    }
  },
});
