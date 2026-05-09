// @ts-nocheck
/**
 * SaaS Vala Enterprise - User Impersonation API
 * Super Admin user impersonation
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const impersonateSchema = z.object({
  targetUserId: z.string(),
});

export const Route = createFileRoute('/api/admin/impersonate')({
  POST: async ({ request }) => {
    const logger = Logger.createRequestLogger('admin-impersonate-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      const body = await request.json();
      const validatedData = impersonateSchema.parse(body);

      logger.info('Starting impersonation', { adminUserId: auth.userId, targetUserId: validatedData.targetUserId });

      // Check if target user exists
      const targetUser = await prisma.user.findUnique({
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

      if (!targetUser) {
        return Response.json(
          { error: 'Target user not found' },
          { status: 404 }
        );
      }

      if (targetUser.status !== 'ACTIVE') {
        return Response.json(
          { error: 'Cannot impersonate inactive user' },
          { status: 400 }
        );
      }

      // Create impersonation session
      const impersonationToken = randomUUID();
      const impersonationSession = await prisma.session.create({
        data: {
          userId: auth.userId,
          token: impersonationToken,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          isActive: true,
          metadata: {
            type: 'IMPERSONATION',
            originalUserId: auth.userId,
            targetUserId: validatedData.targetUserId,
            targetUserRoles: targetUser.roles.map((r) => r.name),
            startedAt: new Date().toISOString(),
          },
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          userId: auth.userId,
          action: 'impersonation.started',
          entity: 'user',
          entityId: validatedData.targetUserId,
          metadata: {
            targetUserId: validatedData.targetUserId,
            targetUserName: targetUser.displayName,
          },
        },
      });

      logger.info('Impersonation started successfully', { impersonationToken });

      return Response.json({
        impersonationToken,
        targetUser: {
          id: targetUser.id,
          displayName: targetUser.displayName,
          email: targetUser.email,
          roles: targetUser.roles,
        },
        expiresAt: impersonationSession.expiresAt,
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

      logger.error('Failed to start impersonation', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
