// @ts-nocheck
/**
 * SaaS Vala Enterprise - Download Analytics API
 * Download statistics and analytics
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/analytics/downloads')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('download-analytics-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching download analytics', { userId: auth.userId });

      const companyId = auth.companyId;

      // Get download statistics
      const [
        totalDownloads,
        uniqueDownloaders,
        downloadsByProduct,
        downloadsByDate,
      ] = await Promise.all([
        prisma.download.count({
          where: {
            ...(companyId ? {} : {}),
          },
        }),
        prisma.download.groupBy({
          by: ['userId'],
          where: {
            ...(companyId ? {} : {}),
          },
        }),
        prisma.download.groupBy({
          by: ['productId'],
          _count: true,
          where: {
            ...(companyId ? {} : {}),
          },
        }),
        prisma.download.groupBy({
          by: ['createdAt'],
          _count: true,
          where: {
            ...(companyId ? {} : {}),
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

      // Get product names for downloads
      const productDownloads = await Promise.all(
        downloadsByProduct.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { id: true, name: true, slug: true },
          });
          return {
            productId: item.productId,
            productName: product?.name || 'Unknown',
            downloads: item._count,
          };
        })
      );

      // Format date data
      const dailyDownloads = downloadsByDate.map((item) => ({
        date: new Date(item.createdAt).toISOString().split('T')[0],
        downloads: item._count,
      }));

      const analytics = {
        overview: {
          totalDownloads,
          uniqueDownloaders: uniqueDownloaders.length,
        },
        byProduct: productDownloads,
        topProducts: productDownloads
          .sort((a, b) => b.downloads - a.downloads)
          .slice(0, 10),
        dailyTrend: dailyDownloads,
      };

      logger.info('Download analytics fetched successfully', { userId: auth.userId });

      return Response.json({ analytics });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch download analytics', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
