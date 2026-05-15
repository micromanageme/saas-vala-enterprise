// @ts-nocheck
/**
 * SaaS Vala Enterprise - Product Status Workflow API
 * Product status workflow management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const updateProductStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED', 'REJECTED']),
  reason: z.string().optional(),
});

export const Route = createFileRoute('/api/products/$productId/status')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const logger = Logger.createRequestLogger('product-status-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          const body = await request.json();
          const validatedData = updateProductStatusSchema.parse(body);

          logger.info('Updating product status', { userId: auth.userId, productId: params.productId });

          // Check if product exists
          const product = await prisma.product.findUnique({
            where: { id: params.productId },
          });

          if (!product) {
            return Response.json(
              { error: 'Product not found' },
              { status: 404 }
            );
          }

          // Update product status
          const updatedProduct = await prisma.product.update({
            where: { id: params.productId },
            data: {
              isActive: validatedData.status === 'PUBLISHED',
              metadata: {
                ...product.metadata,
                status: validatedData.status,
                statusReason: validatedData.reason,
                statusUpdatedAt: new Date().toISOString(),
                statusUpdatedBy: auth.userId,
              },
            },
          });

          // Log activity
          await prisma.activity.create({
            data: {
              userId: auth.userId,
              action: 'product.status_updated',
              entity: 'product',
              entityId: params.productId,
              metadata: {
                oldStatus: product.metadata?.status || 'UNKNOWN',
                newStatus: validatedData.status,
                reason: validatedData.reason,
              },
            },
          });

          logger.info('Product status updated successfully', { productId: params.productId });

          return Response.json({ product: updatedProduct });
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

          logger.error('Failed to update product status', error);

          return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      },
    },
  },
});
