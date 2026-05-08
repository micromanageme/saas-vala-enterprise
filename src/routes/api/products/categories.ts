/**
 * SaaS Vala Enterprise - Product Categories API
 * Product category and tag management (Enterprise Scale: 2000+ products)
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  metadata: z.any().optional(),
});

export const Route = createFileRoute('/api/products/categories')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('product-categories-api');
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching product categories', { userId: auth.userId, type });

      const categories = await prisma.category.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          children: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      const data: any = { categories };

      if (type === 'all' || type === 'kpis') {
        const totalCategories = categories.length;
        const rootCategories = categories.filter(c => !c.parentId).length;
        const totalProducts = await prisma.product.count();

        data.kpis = {
          totalCategories,
          rootCategories,
          totalProducts,
          avgProductsPerCategory: totalProducts / Math.max(totalCategories, 1),
          totalCategoriesDelta: 5,
          rootCategoriesDelta: 2,
          totalProductsDelta: 12,
        };
      }

      logger.info('Product categories fetched successfully', { count: categories.length });

      return Response.json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      logger.error('Failed to fetch product categories', error);

      return Response.json({ success: false, error: 'Failed to fetch product categories' }, { status: 500 });
    }
  },

  POST: async ({ request }) => {
    const logger = Logger.createRequestLogger('product-categories-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const body = await request.json();
      const validatedData = createCategorySchema.parse(body);

      logger.info('Creating product category', { userId: auth.userId });

      const category = await prisma.category.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          description: validatedData.description,
          parentId: validatedData.parentId,
          metadata: validatedData.metadata || {},
        },
      });

      logger.info('Product category created successfully', { categoryId: category.id });

      return Response.json({ success: true, category });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      if (error instanceof z.ZodError) {
        return Response.json({ error: 'Validation error', details: error.errors }, { status: 400 });
      }

      logger.error('Failed to create product category', error);

      return Response.json({ success: false, error: 'Failed to create product category' }, { status: 500 });
    }
  },
});
