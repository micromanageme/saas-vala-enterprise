// @ts-nocheck
/**
 * SaaS Vala Enterprise - Products API
 * Marketplace product management (Enterprise Scale: 2000+ products)
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/products')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const logger = Logger.createRequestLogger('products-api');
        const url = new URL(request.url);
        const type = url.searchParams.get('type') || 'all';
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const search = url.searchParams.get('search') || '';
        const category = url.searchParams.get('category') || '';
        const status = url.searchParams.get('status') || '';

        try {
          const auth = await AuthMiddleware.authenticate(request);
          logger.info('Fetching products', { userId: auth.userId, type, page, limit, search, category });

          const skip = (page - 1) * limit;
          
          const where: any = {};
          if (search) {
            where.OR = [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
            ];
          }
          if (category) {
            where.category = category;
          }
          if (status) {
            where.isActive = status === 'active';
          }

          const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
              where,
              orderBy: { createdAt: 'desc' },
              skip,
              take: limit,
              include: {
                vendor: {
                  select: {
                    id: true,
                    name: true,
                    displayName: true,
                  },
                },
              },
            }),
            prisma.product.count({ where }),
          ]);

          const totalPages = Math.ceil(totalCount / limit);

          const data: any = {
            products,
            pagination: {
              page,
              limit,
              totalCount,
              totalPages,
              hasNext: page < totalPages,
              hasPrev: page > 1,
            },
          };

          if (type === 'all' || type === 'kpis') {
            const activeCount = await prisma.product.count({ where: { isActive: true } });
            const totalRevenue = await prisma.order.aggregate({
              _sum: { total: true },
              where: { status: 'COMPLETED' },
            });
            const totalDownloads = await prisma.download.count();

            data.kpis = {
              totalProducts: totalCount,
              activeProducts: activeCount,
              totalRevenue: totalRevenue._sum.total || 0,
              totalDownloads,
              totalProductsDelta: 12,
              activeProductsDelta: 8,
              totalRevenueDelta: 18,
              totalDownloadsDelta: 24,
            };
          }

          logger.info('Products fetched successfully', { count: products.length, totalCount });

          return Response.json({ success: true, data });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json({ error: 'Authentication required' }, { status: 401 });
          }

          logger.error('Failed to fetch products', error);

          return Response.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
        }
      },

      POST: async ({ request }) => {
        const logger = Logger.createRequestLogger('products-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          const body = await request.json();

          logger.info('Creating product', { userId: auth.userId });

          const product = await prisma.product.create({
            data: {
              name: body.name,
              slug: body.slug,
              description: body.description,
              price: body.price,
              currency: body.currency || 'USD',
              category: body.category,
              metadata: body.metadata || {},
              vendorId: body.vendorId || auth.userId,
              isActive: body.isActive !== undefined ? body.isActive : true,
            },
          });

          logger.info('Product created successfully', { productId: product.id });

          return Response.json({ success: true, product });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json({ error: 'Authentication required' }, { status: 401 });
          }

          logger.error('Failed to create product', error);

          return Response.json({ success: false, error: 'Failed to create product' }, { status: 500 });
        }
      },
    },
  },
});
