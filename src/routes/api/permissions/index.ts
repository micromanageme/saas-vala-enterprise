/**
 * SaaS Vala Enterprise - Permissions API
 * Enterprise permission management endpoints
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { RBACService } from '@/lib/rbac';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/permissions/')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('permissions-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching permissions', { userId: auth.userId });

      // Only super admins and admins can view all permissions
      if (!auth.isSuperAdmin && !auth.roles.includes('admin')) {
        return new Response(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const permissions = await prisma.permission.findMany({
        select: {
          id: true,
          resource: true,
          action: true,
          category: true,
          description: true,
        },
        orderBy: [
          { category: 'asc' },
          { resource: 'asc' },
          { action: 'asc' },
        ],
      });

      logger.info('Permissions fetched successfully', { count: permissions.length });

      return new Response(JSON.stringify({ permissions }), {
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

      logger.error('Failed to fetch permissions', error);

      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
});
