// @ts-nocheck
/**
 * SaaS Vala Enterprise - Global User Control API
 * Super Admin user management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']),
  reason: z.string().optional(),
});

export const Route = createFileRoute('/api/admin/users')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('admin-users-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      
      if (!auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }

      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const search = url.searchParams.get('search') || '';

      logger.info('Fetching all users', { userId: auth.userId, page, search });

      const where = search
        ? {
            OR: [
              { displayName: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : {};

      const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
          where,
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
            roles: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                sessions: true,
                licenses: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.user.count({ where }),
      ]);

      logger.info('Users fetched successfully', { count: users.length, totalCount });

      return Response.json({
        users,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch users', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
