// @ts-nocheck
/**
 * SaaS Vala Enterprise - Universal Security Center API
 * Root-level security control
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/root/security')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('root-security-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          
          const isRoot = auth.isSuperAdmin && request.headers.get('X-Root-Access') === 'true';
          
          if (!isRoot) {
            return Response.json(
              { error: 'Unauthorized access - Root level only' },
              { status: 403 }
            );
          }

          const url = new URL(request.url);
          const type = url.searchParams.get('type') || 'all';

          logger.info('Fetching Universal Security Center data', { userId: auth.userId, type });

          const data: any = {};

          if (type === 'all' || type === 'threats') {
            data.threats = [
              { id: 'threat-001', type: 'DDOS', severity: 'HIGH', status: 'MITIGATED', source: '192.168.1.100', timestamp: new Date() },
              { id: 'threat-002', type: 'SQL_INJECTION', severity: 'CRITICAL', status: 'BLOCKED', source: '10.0.0.50', timestamp: new Date(Date.now() - 3600000) },
              { id: 'threat-003', type: 'BRUTE_FORCE', severity: 'MEDIUM', status: 'MONITORING', source: '172.16.0.25', timestamp: new Date(Date.now() - 7200000) },
            ];
          }

          if (type === 'all' || type === 'siem') {
            data.siem = {
              totalEvents: 1245678,
              criticalEvents: 23,
              highEvents: 145,
              mediumEvents: 1234,
              lowEvents: 45678,
              lastUpdate: new Date().toISOString(),
            };
          }

          if (type === 'all' || type === 'firewall') {
            data.firewall = [
              { id: 'fw-001', name: 'web-firewall', status: 'ACTIVE', rules: 245, blocked: 12345, allowed: 987654 },
              { id: 'fw-002', name: 'api-firewall', status: 'ACTIVE', rules: 189, blocked: 5678, allowed: 456789 },
            ];
          }

          if (type === 'all' || type === 'audit-trails') {
            const auditActivities = await prisma.activity.findMany({
              orderBy: { createdAt: 'desc' },
              take: 100,
              include: {
                user: {
                  select: {
                    displayName: true,
                    email: true,
                  },
                },
              },
            });

            data.auditTrails = auditActivities.map((a) => ({
              id: a.id,
              action: a.action,
              entity: a.entity,
              entityId: a.entityId,
              user: a.user?.displayName || a.user?.email,
              timestamp: a.createdAt,
              metadata: a.metadata,
            }));
          }

          logger.info('Universal Security Center data fetched successfully');

          return Response.json({ success: true, data });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }

          logger.error('Failed to fetch Universal Security Center data', error);

          return Response.json(
            { success: false, error: 'Failed to fetch security data' },
            { status: 500 }
          );
        }
      },
    },
  },
});
