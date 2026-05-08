/**
 * SaaS Vala Enterprise - Product Media API
 * Product media and file upload management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const createMediaSchema = z.object({
  productId: z.string(),
  type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'FILE']),
  url: z.string().url(),
  fileName: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
  metadata: z.any().optional(),
});

export const Route = createFileRoute('/api/products/media')({
  GET: async ({ request }) => {
    const logger = Logger.createRequestLogger('product-media-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const url = new URL(request.url);
      const productId = url.searchParams.get('productId');

      logger.info('Fetching product media', { userId: auth.userId, productId });

      const media = await prisma.productMedia.findMany({
        where: {
          ...(productId ? { productId } : {}),
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      logger.info('Product media fetched successfully', { count: media.length });

      return Response.json({ media });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to fetch product media', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },

  POST: async ({ request }) => {
    const logger = Logger.createRequestLogger('product-media-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const body = await request.json();
      const validatedData = createMediaSchema.parse(body);

      logger.info('Creating product media', { userId: auth.userId, productId: validatedData.productId });

      const media = await prisma.productMedia.create({
        data: {
          productId: validatedData.productId,
          type: validatedData.type,
          url: validatedData.url,
          fileName: validatedData.fileName,
          fileSize: validatedData.fileSize,
          mimeType: validatedData.mimeType,
          metadata: validatedData.metadata || {},
        },
      });

      logger.info('Product media created successfully', { mediaId: media.id });

      return Response.json({ media });
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

      logger.error('Failed to create product media', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
