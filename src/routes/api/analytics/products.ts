// @ts-nocheck
/**
 * SaaS Vala Enterprise - Product Analytics API
 * Product performance analytics
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/analytics/products')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('product-analytics-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching product analytics', { userId: auth.userId });

      const companyId = auth.companyId;

      // Get product statistics
      const [
        totalProducts,
        activeProducts,
        totalDownloads,
        totalLicenses,
        revenueByProduct,
      ] = await Promise.all([
        prisma.product.count({
          where: {
            ...(companyId ? {} : {}), // All products for super admin
          },
        }),
        prisma.product.count({
          where: {
            isActive: true,
            ...(companyId ? {} : {}),
          },
        }),
        prisma.download.count({
          where: {
            ...(companyId ? {} : {}),
          },
        }),
        prisma.license.count({
          where: {
            status: 'ACTIVE',
            ...(companyId ? {} : {}),
          },
        }),
        prisma.license.groupBy({
          by: ['productId'],
          _count: true,
          where: {
            status: 'ACTIVE',
            ...(companyId ? {} : {}),
          },
        }),
      ]);

      // Calculate revenue by product
      const productRevenue = await Promise.all(
        revenueByProduct.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { id: true, name: true, price: true },
          });
          return {
            productId: item.productId,
            productName: product?.name || 'Unknown',
            licenses: item._count,
            revenue: (product?.price || 0) * item._count,
          };
        })
      );

      const analytics = {
        overview: {
          totalProducts,
          activeProducts,
          totalDownloads,
          totalLicenses,
        },
        revenueByProduct: productRevenue,
        topSellingProducts: productRevenue
          .sort((a, b) => b.licenses - a.licenses)
          .slice(0, 10),
      };

      logger.info('Product analytics fetched successfully', { userId: auth.userId });

      return Response.json({ analytics });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch product analytics', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
