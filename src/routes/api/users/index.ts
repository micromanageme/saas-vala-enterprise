// @ts-nocheck
/**
 * SaaS Vala Enterprise - Users API
 * Enterprise user management endpoints
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/users/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('users-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          logger.info('Fetching users', { userId: auth.userId });

          // Only super admins and admins can view all users
          if (!auth.isSuperAdmin && !auth.roles.includes('admin')) {
            return new Response(
              JSON.stringify({ error: 'Insufficient permissions' }),
              { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
          }

          const users = await prisma.user.findMany({
            where: {
              deletedAt: null,
              ...(auth.companyId ? { companyId: auth.companyId } : {}),
            },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              displayName: true,
              avatar: true,
              status: true,
              isSuperAdmin: true,
              companyId: true,
              createdAt: true,
              updatedAt: true,
              roles: {
                select: {
                  role: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          });

          logger.info('Users fetched successfully', { count: users.length });

          return new Response(JSON.stringify({ users }), {
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

          logger.error('Failed to fetch users', error);

          return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      },
    },
  },
});
