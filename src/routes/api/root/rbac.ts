/**
 * SaaS Vala Enterprise - Root RBAC Engine API
 * Universal permission control at root level
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/root/rbac')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('root-rbac-api');

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

      logger.info('Fetching Root RBAC Engine data', { userId: auth.userId, type });

      const data: any = {};

      if (type === 'all' || type === 'universal-permissions') {
        const permissions = await prisma.permission.findMany({
          include: {
            _count: {
              select: {
                roles: true,
              },
            },
          },
          orderBy: {
            resource: 'asc',
          },
        });

        data.permissions = permissions;
      }

      if (type === 'all' || type === 'role-graph') {
        const roles = await prisma.role.findMany({
          include: {
            permissions: {
              select: {
                id: true,
                resource: true,
                action: true,
              },
            },
            _count: {
              select: {
                users: true,
              },
            },
          },
          orderBy: {
            level: 'desc',
          },
        });

        data.roleGraph = roles.map((r) => ({
          id: r.id,
          name: r.name,
          level: r.level,
          isSystem: r.isSystem,
          userCount: r._count.users,
          permissionCount: r.permissions.length,
          permissions: r.permissions.map((p) => `${p.resource}.${p.action}`),
        }));
      }

      if (type === 'all' || type === 'access-tree') {
        // Build access tree by resource
        const permissions = await prisma.permission.findMany({
          include: {
            roles: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        const accessTree: Record<string, any> = {};
        
        permissions.forEach((p) => {
          if (!accessTree[p.resource]) {
            accessTree[p.resource] = {
              resource: p.resource,
              actions: [],
              roles: [],
            };
          }
          accessTree[p.resource].actions.push(p.action);
          p.roles.forEach((r) => {
            if (!accessTree[p.resource].roles.includes(r.name)) {
              accessTree[p.resource].roles.push(r.name);
            }
          });
        });

        data.accessTree = Object.values(accessTree);
      }

      logger.info('Root RBAC Engine data fetched successfully');

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch Root RBAC Engine data', error);

      return Response.json(
        { success: false, error: 'Failed to fetch root RBAC data' },
        { status: 500 }
      );
    }
  },
});
