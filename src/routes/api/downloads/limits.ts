// @ts-nocheck
/**
 * SaaS Vala Enterprise - Download Limits API
 * Download limit management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/downloads/limits')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('download-limits-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching download limits', { userId: auth.userId });

      const url = new URL(request.url);
      const productId = url.searchParams.get('productId');

      // Get download count for user
      const downloadCount = await prisma.download.count({
        where: {
          userId: auth.userId,
          ...(productId ? { productId } : {}),
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      });

      // Default limits
      const dailyLimit = 10;
      const remaining = Math.max(0, dailyLimit - downloadCount);

      logger.info('Download limits fetched successfully', { userId: auth.userId, remaining });

      return Response.json({
        dailyLimit,
        used: downloadCount,
        remaining,
        canDownload: remaining > 0,
      });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch download limits', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
