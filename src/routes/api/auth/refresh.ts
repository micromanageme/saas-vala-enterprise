// @ts-nocheck
/**
 * SaaS Vala Enterprise - API: Authentication
 * Refresh token endpoint
 */

import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { JWTService, SessionService } from '@/lib/auth/index';
import { RBACService } from '@/lib/rbac';

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export const Route = createFileRoute('/api/auth/refresh')({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const { refreshToken } = refreshSchema.parse(body);

      // Verify refresh token
      const payload = JWTService.verifyRefreshToken(refreshToken);

      // Check if session exists and is active
      const session = await prisma.session.findUnique({
        where: { refreshToken },
        include: {
          user: {
            include: {
              roles: {
                include: {
                  role: true,
                },
              },
            },
          },
        },
      });

      if (!session || !session.isActive) {
        return Response.json(
          { error: 'Invalid or expired refresh token', code: 'INVALID_REFRESH_TOKEN' },
          { status: 401 }
        );
      }

      if (session.expiresAt < new Date()) {
        return Response.json(
          { error: 'Session expired', code: 'SESSION_EXPIRED' },
          { status: 401 }
        );
      }

      // Get user roles
      const roles = session.user.roles
        .filter((ur: any) => ur.isActive && (!ur.expiresAt || ur.expiresAt > new Date()))
        .map((ur: any) => ur.role.slug);

      // Generate new token pair
      const tokens = JWTService.generateTokenPair({
        userId: session.user.id,
        email: session.user.email,
        companyId: session.user.companyId || undefined,
        roles,
        workspaceId: session.user.defaultWorkspaceId || undefined,
        sessionId: session.id,
        isImpersonated: session.impersonatedBy ? true : undefined,
        originalUserId: session.originalSessionId ? payload.userId : undefined,
      });

      // Update session activity
      await SessionService.updateSessionActivity(session.token);

      // Invalidate RBAC cache
      RBACService.invalidateCache(session.user.id);

      return Response.json({
        success: true,
        data: {
          tokens,
          session: {
            id: session.id,
            expiresAt: session.expiresAt,
          },
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { error: 'Validation error', details: error.errors, code: 'VALIDATION_ERROR' },
          { status: 400 }
        );
      }

      console.error('Refresh token error:', error);
      return Response.json(
        { error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }
  },
});
