/**
 * SaaS Vala Enterprise - Current User API
 * Get current authenticated user information
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { RBACService } from '@/lib/rbac';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/me/')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('me-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching current user', { userId: auth.userId });

      const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatar: true,
          status: true,
          isSuperAdmin: true,
          companyId: true,
          defaultWorkspaceId: true,
          createdAt: true,
          updatedAt: true,
          roles: {
            where: {
              isActive: true,
              OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } },
              ],
            },
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  description: true,
                  level: true,
                },
              },
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              status: true,
            },
          },
        },
      });

      if (!user) {
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Get user permissions
      const permissions = await RBACService.getUserPermissions(user.id);
      const accessibleModules = await RBACService.getAccessibleModules(user.id);

      logger.info('Current user fetched successfully', { userId: user.id });

      return new Response(
        JSON.stringify({
          user,
          permissions: permissions.permissions,
          roles: permissions.roles,
          isSuperAdmin: permissions.isSuperAdmin,
          accessibleModules,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      logger.error('Failed to fetch current user', error);

      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
});
