/**
 * SaaS Vala Enterprise - API: Authentication
 * Logout endpoint with session invalidation
 */

import { createFileRoute } from '@tanstack/react-router';
import { JWTService } from '@/lib/auth';
import { SessionService } from '@/lib/audit';

export const Route = createFileRoute('/api/auth/logout')({
  POST: async ({ request }) => {
    try {
      const authHeader = request.headers.get('authorization');
      const token = JWTService.extractTokenFromHeader(authHeader);

      if (!token) {
        return Response.json(
          { error: 'No token provided', code: 'NO_TOKEN' },
          { status: 401 }
        );
      }

      // Verify token
      const payload = JWTService.verifyAccessToken(token);

      // Invalidate session
      if (payload.sessionId) {
        await SessionService.invalidateSessionByToken(token);
      }

      return Response.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      return Response.json(
        { error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }
  },
});
