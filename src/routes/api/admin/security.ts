/**
 * SaaS Vala Enterprise - Security Center API
 * Security monitoring and threat detection
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/admin/security')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('admin-security-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      logger.info('Fetching security data', { userId: auth.userId });

      // Get security statistics
      const [
        failedLoginAttempts,
        suspiciousActivities,
        recentSuspensions,
        activeSessionsByIp,
      ] = await Promise.all([
        prisma.activity.count({
          where: {
            action: 'login.failed',
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.activity.findMany({
          where: {
            action: {
              in: ['license.validation_failed', 'permission.denied', 'suspicious.activity'],
            },
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
          take: 20,
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                email: true,
              },
            },
          },
        }),
        prisma.activity.findMany({
          where: {
            action: 'user.suspended',
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          take: 20,
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                email: true,
              },
            },
          },
        }),
        prisma.session.groupBy({
          by: ['ipAddress'],
          where: {
            isActive: true,
          },
          _count: true,
          orderBy: {
            _count: {
              desc: true,
            },
          },
          take: 10,
        }),
      ]);

      // Get audit logs
      const auditLogs = await prisma.auditLog.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      });

      const security = {
        threats: {
          failedLogins: failedLoginAttempts,
          suspiciousActivities: suspiciousActivities.length,
          recentSuspensions: recentSuspensions.length,
        },
        sessions: {
          activeSessionsByIp: activeSessionsByIp.map((item) => ({
            ip: item.ipAddress,
            count: item._count,
          })),
        },
        auditLogs: {
          recent: auditLogs,
        },
      };

      logger.info('Security data fetched successfully');

      return Response.json({ security });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch security data', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
