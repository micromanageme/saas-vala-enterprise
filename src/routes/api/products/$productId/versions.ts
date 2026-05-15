// @ts-nocheck
/**
 * SaaS Vala Enterprise - Product Versions API
 * Product version management
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const createVersionSchema = z.object({
  version: z.string(),
  changelog: z.string(),
  downloadUrl: z.string().url(),
  fileSize: z.number(),
  checksum: z.string().optional(),
  metadata: z.any().optional(),
});

export const Route = createFileRoute('/api/products/$productId/versions')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const logger = Logger.createRequestLogger('product-versions-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          logger.info('Fetching product versions', { userId: auth.userId, productId: params.productId });

          const versions = await prisma.productVersion.findMany({
            where: {
              productId: params.productId,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });

          logger.info('Product versions fetched successfully', { count: versions.length });

          return Response.json({ versions });
        } catch (error: any) {
          if (error.message === 'No authentication token provided') {
            return Response.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }

          logger.error('Failed to fetch product versions', error);

          return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      },

      POST: async ({ request, params }) => {
        const logger = Logger.createRequestLogger('product-versions-api');

        try {
          const auth = await AuthMiddleware.authenticate(request);
          const body = await request.json();
          const validatedData = createVersionSchema.parse(body);

          logger.info('Creating product version', { userId: auth.userId, productId: params.productId });

          const version = await prisma.productVersion.create({
            data: {
              productId: params.productId,
              version: validatedData.version,
              changelog: validatedData.changelog,
              downloadUrl: validatedData.downloadUrl,
              fileSize: validatedData.fileSize,
              checksum: validatedData.checksum,
              metadata: validatedData.metadata || {},
            },
          });

          logger.info('Product version created successfully', { versionId: version.id });

          return Response.json({ version });
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

          logger.error('Failed to create product version', error);

          return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
        }
      },
    },
  },
});
