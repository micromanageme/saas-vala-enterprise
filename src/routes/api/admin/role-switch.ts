/**
 * SaaS Vala Enterprise - Global Role Switch API
 * Instant role switching for Super Admin
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const switchRoleSchema = z.object({
  targetUserId: z.string(),
  newRoleIds: z.array(z.string()),
});

export const Route = createFileRoute('/api/admin/role-switch')({
  POST: async ({ request }) => {
    const logger = Logger.createRequestLogger('admin-role-switch-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      const body = await request.json();
      const validatedData = switchRoleSchema.parse(body);

      logger.info('Switching user roles', { adminUserId: auth.userId, targetUserId: validatedData.targetUserId });

      // Get current roles
      const targetUser = await prisma.user.findUnique({
        where: { id: validatedData.targetUserId },
        include: {
          roles: true,
        },
      });

      if (!targetUser) {
        return Response.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const oldRoleIds = targetUser.roles.map((r) => r.id);

      // Disconnect old roles
      await prisma.user.update({
        where: { id: validatedData.targetUserId },
        data: {
          roles: {
            disconnect: oldRoleIds.map((id) => ({ id })),
          },
        },
      });

      // Connect new roles
      await prisma.user.update({
        where: { id: validatedData.targetUserId },
        data: {
          roles: {
            connect: validatedData.newRoleIds.map((id) => ({ id })),
          },
        },
      });

      // Get updated user with roles
      const updatedUser = await prisma.user.findUnique({
        where: { id: validatedData.targetUserId },
        include: {
          roles: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          userId: auth.userId,
          action: 'role.switched',
          entity: 'user',
          entityId: validatedData.targetUserId,
          metadata: {
            oldRoleIds,
            newRoleIds: validatedData.newRoleIds,
          },
        },
      });

      logger.info('Roles switched successfully', { targetUserId: validatedData.targetUserId });

      return Response.json({
        user: updatedUser,
        oldRoleIds,
        newRoleIds: validatedData.newRoleIds,
      });
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

      logger.error('Failed to switch roles', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
