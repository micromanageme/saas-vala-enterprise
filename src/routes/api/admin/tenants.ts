/**
 * SaaS Vala Enterprise - Global Tenant Control API
 * Super Admin tenant management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const createTenantSchema = z.object({
  name: z.string(),
  slug: z.string(),
  domain: z.string().optional(),
  metadata: z.any().optional(),
});

export const Route = createFileRoute('/api/admin/tenants')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('admin-tenants-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      // Only super admin can access
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      logger.info('Fetching all tenants', { userId: auth.userId });

      const tenants = await prisma.company.findMany({
        include: {
          _count: {
            select: {
              users: true,
              workspaces: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      logger.info('Tenants fetched successfully', { count: tenants.length });

      return Response.json({ tenants });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch tenants', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },

  POST: async ({ request }) => {
    const logger = Logger.createRequestLogger('admin-tenants-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      const body = await request.json();
      const validatedData = createTenantSchema.parse(body);

      logger.info('Creating tenant', { userId: auth.userId });

      const tenant = await prisma.company.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          domain: validatedData.domain,
          metadata: validatedData.metadata || {},
        },
      });

      logger.info('Tenant created successfully', { tenantId: tenant.id });

      return Response.json({ tenant });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (error instanceof z.ZodError) {
        return Response.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }

      logger.error('Failed to create tenant', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
