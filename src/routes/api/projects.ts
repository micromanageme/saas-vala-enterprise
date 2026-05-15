// @ts-nocheck
/**
 * SaaS Vala Enterprise - Projects API
 * Tasks, sprints & gantt
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/projects')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('projects-api');
        const url = new URL(request.url);
        const type = url.searchParams.get('type') || 'all';

        try {
          const auth = await AuthMiddleware.authenticate(request);
          logger.info('Fetching Projects data', { userId: auth.userId, type });

          const data: any = {};

          if (type === 'all' || type === 'kpis') {
            data.kpis = {
              active: 42,
              openTasks: 312,
              sprints: 8,
              bugs: 24,
              activeDelta: 4,
              openTasksDelta: 22,
              sprintsDelta: 1,
              bugsDelta: -3,
            };
          }

          if (type === 'all' || type === 'projects') {
            data.projects = [
              { id: 'PRJ-001', name: 'Vala Platform v3', lead: 'CTO', progress: 68, status: 'On Track', startDate: '2024-01-15' },
              { id: 'PRJ-002', name: 'POS Mobile', lead: 'PM', progress: 42, status: 'At Risk', startDate: '2024-02-01' },
              { id: 'PRJ-003', name: 'AI Integration', lead: 'Tech Lead', progress: 85, status: 'On Track', startDate: '2023-11-20' },
            ];
          }

          logger.info('Projects data fetched successfully');

          return Response.json({ success: true, data });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json({ error: 'Authentication required' }, { status: 401 });
          }

          logger.error('Failed to fetch Projects data', error);

          return Response.json({ success: false, error: 'Failed to fetch Projects data' }, { status: 500 });
        }
      },
    },
  },
});
