/**
 * SaaS Vala Enterprise - Session Control API
 * Session monitoring and revocation
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/admin/sessions')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('admin-sessions-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      const url = new URL(request.url);
      const userId = url.searchParams.get('userId');

      logger.info('Fetching sessions', { userId });

      const sessions = await prisma.session.findMany({
        where: {
          ...(userId ? { userId } : {}),
        },
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },
          device: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 100,
      });

      logger.info('Sessions fetched successfully', { count: sessions.length });

      return Response.json({ sessions });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch sessions', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
