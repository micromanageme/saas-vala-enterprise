// @ts-nocheck
/**
 * SaaS Vala Enterprise - Session Revoke API
 * Session revocation for forced logout
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/admin/sessions/$sessionId/revoke')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const logger = Logger.createRequestLogger('admin-session-revoke-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          
          if (!auth.isSuperAdmin) {
            return Response.json(
              { error: 'Unauthorized access' },
              { status: 403 }
            );
          }

          logger.info('Revoking session', { adminUserId: auth.userId, sessionId: params.sessionId });

          // Check if session exists
          const session = await prisma.session.findUnique({
            where: { id: params.sessionId },
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                },
              },
            },
          });

          if (!session) {
            return Response.json(
              { error: 'Session not found' },
              { status: 404 }
            );
          }

          // Revoke session
          const updatedSession = await prisma.session.update({
            where: { id: params.sessionId },
            data: {
              isActive: false,
              revokedAt: new Date(),
              revokedBy: auth.userId,
            },
          });

          // Log activity
          await prisma.activity.create({
            data: {
              userId: auth.userId,
              action: 'session.revoked',
              entity: 'session',
              entityId: params.sessionId,
              metadata: {
                targetUserId: session.userId,
                sessionIp: session.ipAddress,
              },
            },
          });

          logger.info('Session revoked successfully', { sessionId: params.sessionId });

          return Response.json({ session: updatedSession });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }

          logger.error('Failed to revoke session', error);

          return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      },
    },
  },
});
