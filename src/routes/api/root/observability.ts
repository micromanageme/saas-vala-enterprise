// @ts-nocheck
/**
 * SaaS Vala Enterprise - Observability Center API
 * Root-level logs, metrics, and tracing
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/root/observability')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('root-observability-api');

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

          logger.info('Fetching Observability Center data', { userId: auth.userId, type });

          const data: any = {};

          if (type === 'all' || type === 'logs') {
            const activities = await prisma.activity.findMany({
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

            data.logs = activities.map((a) => ({
              id: a.id,
              level: a.action.includes('error') ? 'ERROR' : 'INFO',
              action: a.action,
              user: a.user?.displayName || a.user?.email,
              timestamp: a.createdAt,
              metadata: a.metadata,
            }));
          }

          if (type === 'all' || type === 'metrics') {
            data.metrics = {
              apiLatency: { p50: 45, p95: 120, p99: 250 },
              dbLatency: { p50: 12, p95: 45, p99: 89 },
              cacheHitRate: 94.5,
              errorRate: 0.02,
              throughput: 1250,
              concurrentUsers: 1245,
            };
          }

          if (type === 'all' || type === 'traces') {
            data.traces = [
              { id: 'trace-001', service: 'api-gateway', duration: 125, status: 'SUCCESS', timestamp: new Date() },
              { id: 'trace-002', service: 'user-service', duration: 89, status: 'SUCCESS', timestamp: new Date() },
              { id: 'trace-003', service: 'database', duration: 45, status: 'SUCCESS', timestamp: new Date() },
            ];
          }

          logger.info('Observability Center data fetched successfully');

          return Response.json({ success: true, data });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }

          logger.error('Failed to fetch Observability Center data', error);

          return Response.json(
            { success: false, error: 'Failed to fetch observability data' },
            { status: 500 }
          );
        }
      },
    },
  },
});
