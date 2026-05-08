/**
 * SaaS Vala Enterprise - Product Detail API
 * Single product CRUD operations
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const updateProductSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  metadata: z.any().optional(),
});

export const Route = createFileRoute('/api/products/$productId')({
  GET: async ({ request, params }) => {
    const logger = Logger.createRequestLogger('product-detail-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Fetching product', { userId: auth.userId, productId: params.productId });

      const product = await prisma.product.findUnique({
        where: { id: params.productId },
        include: {
          licenses: {
            where: { userId: auth.userId },
          },
          downloads: {
            where: { userId: auth.userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!product) {
        return Response.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      logger.info('Product fetched successfully', { productId: product.id });

      return Response.json({ product });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch product', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },

  PUT: async ({ request, params }) => {
    const logger = Logger.createRequestLogger('product-detail-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const body = await request.json();
      const validatedData = updateProductSchema.parse(body);

      logger.info('Updating product', { userId: auth.userId, productId: params.productId });

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id: params.productId },
      });

      if (!existingProduct) {
        return Response.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      const product = await prisma.product.update({
        where: { id: params.productId },
        data: validatedData,
      });

      logger.info('Product updated successfully', { productId: product.id });

      return Response.json({ product });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (error instanceof z.ZodError) {
        return Response.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }

      logger.error('Failed to update product', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },

  DELETE: async ({ request, params }) => {
    const logger = Logger.createRequestLogger('product-detail-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      logger.info('Deleting product', { userId: auth.userId, productId: params.productId });

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id: params.productId },
      });

      if (!existingProduct) {
        return Response.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      // Soft delete
      const product = await prisma.product.update({
        where: { id: params.productId },
        data: {
          isActive: false,
        },
      });

      logger.info('Product deleted successfully', { productId: product.id });

      return Response.json({ success: true });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to delete product', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
