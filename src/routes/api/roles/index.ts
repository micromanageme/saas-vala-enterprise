// @ts-nocheck
/**
 * SaaS Vala Enterprise - Roles API
 * Enterprise role management endpoints
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/roles/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('roles-api');
        const url = new URL(request.url);
        const type = url.searchParams.get('type') || 'all';

        try {
          const auth = await AuthMiddleware.authenticate(request);
          logger.info('Fetching roles', { userId: auth.userId, type });

          // Only super admins and admins can view all roles
          if (!auth.isSuperAdmin && !auth.roles.includes('admin')) {
            return new Response(
              JSON.stringify({ error: 'Insufficient permissions' }),
              { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
          }

          const roles = await prisma.role.findMany({
            where: {
              deletedAt: null,
            },
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              level: true,
              isSystem: true,
              createdAt: true,
              updatedAt: true,
              _count: {
                select: {
                  users: true,
                  permissions: true,
                },
              },
            },
            orderBy: {
              level: 'desc',
            },
          });

          const totalUsers = await prisma.user.count();
          const totalPermissions = await prisma.permission.count();

          const data: any = { roles };

          if (type === 'all' || type === 'kpis') {
            data.kpis = {
              totalRoles: roles.length,
              totalUsers,
              totalPermissions,
              systemRoles: roles.filter(r => r.isSystem).length,
              customRoles: roles.filter(r => !r.isSystem).length,
              avgUsersPerRole: totalUsers / Math.max(roles.length, 1),
            };
            data.users = await prisma.user.findMany({
              select: {
                id: true,
                displayName: true,
                email: true,
                isSuperAdmin: true,
              },
              take: 100,
            });
            data.permissions = await prisma.permission.findMany({
              select: {
                id: true,
                resource: true,
                action: true,
              },
              take: 100,
            });
          }

          logger.info('Roles fetched successfully', { count: roles.length });

          return new Response(JSON.stringify({ success: true, data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return new Response(
              JSON.stringify({ error: 'Authentication required' }),
              { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
          }

          logger.error('Failed to fetch roles', error);

          return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      },
    },
  },
});
