/**
 * SaaS Vala Enterprise - Dynamic Permission Mutation API
 * Super Admin permission management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const grantPermissionSchema = z.object({
  targetUserId: z.string(),
  permissionIds: z.array(z.string()),
});

const revokePermissionSchema = z.object({
  targetUserId: z.string(),
  permissionIds: z.array(z.string()),
});

export const Route = createFileRoute('/api/admin/permissions')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('admin-permissions-api');

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

      logger.info('Fetching permissions', { userId });

      const where = userId ? { userId } : {};

      const permissions = await prisma.userPermission.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },
          permission: {
            select: {
              id: true,
              name: true,
              resource: true,
              action: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      logger.info('Permissions fetched successfully', { count: permissions.length });

      return Response.json({ permissions });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch permissions', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },

  POST: async ({ request }) => {
    const logger = Logger.createRequestLogger('admin-permissions-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      const body = await request.json();
      const action = body.action; // 'grant' or 'revoke'

      if (action === 'grant') {
        const validatedData = grantPermissionSchema.parse(body);
        
        logger.info('Granting permissions', { adminUserId: auth.userId, targetUserId: validatedData.targetUserId });

        // Grant permissions
        const userPermissions = await Promise.all(
          validatedData.permissionIds.map((permissionId) =>
            prisma.userPermission.create({
              data: {
                userId: validatedData.targetUserId,
                permissionId,
              },
              include: {
                permission: true,
              },
            })
          )
        );

        // Log activity
        await prisma.activity.create({
          data: {
            userId: auth.userId,
            action: 'permissions.granted',
            entity: 'user',
            entityId: validatedData.targetUserId,
            metadata: {
              targetUserId: validatedData.targetUserId,
              permissionIds: validatedData.permissionIds,
            },
          },
        });

        logger.info('Permissions granted successfully');

        return Response.json({ userPermissions });
      } else if (action === 'revoke') {
        const validatedData = revokePermissionSchema.parse(body);
        
        logger.info('Revoking permissions', { adminUserId: auth.userId, targetUserId: validatedData.targetUserId });

        // Revoke permissions
        await prisma.userPermission.deleteMany({
          where: {
            userId: validatedData.targetUserId,
            permissionId: {
              in: validatedData.permissionIds,
            },
          },
        });

        // Log activity
        await prisma.activity.create({
          data: {
            userId: auth.userId,
            action: 'permissions.revoked',
            entity: 'user',
            entityId: validatedData.targetUserId,
            metadata: {
              targetUserId: validatedData.targetUserId,
              permissionIds: validatedData.permissionIds,
            },
          },
        });

        logger.info('Permissions revoked successfully');

        return Response.json({ success: true });
      } else {
        return Response.json(
          { error: 'Invalid action. Use "grant" or "revoke"' },
          { status: 400 }
        );
      }
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

      logger.error('Failed to mutate permissions', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
