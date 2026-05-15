// @ts-nocheck
/**
 * SaaS Vala Enterprise - Health Check API
 * Enterprise health monitoring endpoint
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('health-check');

        try {
          logger.info('Health check requested');

          // Check database connection
          let dbStatus = 'healthy';
          let dbLatency = 0;
          const dbStart = Date.now();

          try {
            await prisma.$queryRaw`SELECT 1`;
            dbLatency = Date.now() - dbStart;
          } catch (error) {
            dbStatus = 'unhealthy';
            logger.error('Database health check failed', error);
          }

          const health = {
            status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            checks: {
              database: {
                status: dbStatus,
                latency: dbLatency,
              },
            },
          };

          logger.info('Health check completed', { status: health.status });

          return new Response(JSON.stringify(health), {
            status: dbStatus === 'healthy' ? 200 : 503,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            },
          });
        } catch (error) {
          logger.error('Health check failed', error);

          return new Response(
            JSON.stringify({
              status: 'unhealthy',
              timestamp: new Date().toISOString(),
              error: 'Internal server error',
            }),
            {
              status: 503,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
      },
    },
  },
});
