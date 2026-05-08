/**
 * SaaS Vala Enterprise - Download History API
 * Download history tracking and limits
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/downloads/history')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('download-history-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching download history', { userId: auth.userId });

      const downloads = await prisma.download.findMany({
        where: {
          userId: auth.userId,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          license: {
            select: {
              id: true,
              licenseKey: true,
            },
          },
          version: {
            select: {
              id: true,
              version: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      });

      logger.info('Download history fetched successfully', { count: downloads.length });

      return Response.json({ downloads });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch download history', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
