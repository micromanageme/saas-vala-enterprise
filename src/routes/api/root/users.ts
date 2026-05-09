// @ts-nocheck
/**
 * SaaS Vala Enterprise - Root User Control API
 * Universal user management at root level
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/root/users')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('root-users-api');

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

      logger.info('Fetching Root User Control data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'universal-users') {
        const users = await prisma.user.findMany({
          include: {
            company: {
              select: {
                name: true,
              },
            },
            roles: {
              select: {
                name: true,
                level: true,
              },
            },
            _count: {
              select: {
                sessions: true,
                licenses: true,
                transactions: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 100,
        });

        data.users = users.map((u) => ({
          id: u.id,
          displayName: u.displayName,
          email: u.email,
          status: u.status,
          isSuperAdmin: u.isSuperAdmin,
          company: u.company?.name,
          roles: u.roles.map((r) => ({ name: r.name, level: r.level })),
          sessions: u._count.sessions,
          licenses: u._count.licenses,
          transactions: u._count.transactions,
          createdAt: u.createdAt,
        }));
      }

      if (type === 'all' || type === 'hidden-roles') {
        const roles = await prisma.role.findMany({
          orderBy: {
            level: 'desc',
          },
        });

        data.roles = roles.map((r) => ({
          id: r.id,
          name: r.name,
          level: r.level,
          isSystem: r.isSystem,
          _count: {
            users: r._count?.users || 0,
            permissions: r._count?.permissions || 0,
          },
        }));
      }

      if (type === 'all' || type === 'session-hijack') {
        const activeSessions = await prisma.session.findMany({
          where: {
            isActive: true,
          },
          include: {
            user: {
              select: {
                displayName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        });

        data.sessions = activeSessions.map((s) => ({
          id: s.id,
          user: s.user?.displayName || s.user?.email,
          ipAddress: s.ipAddress,
          userAgent: s.userAgent,
          isActive: s.isActive,
          createdAt: s.createdAt,
          lastActivity: s.lastActivity,
        }));
      }

      logger.info('Root User Control data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch Root User Control data', error);

      return Response.json(
        { success: false, error: 'Failed to fetch root user data' },
        { status: 500 }
      );
    }
  },
});
