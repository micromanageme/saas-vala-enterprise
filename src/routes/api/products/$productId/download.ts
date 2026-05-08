/**
 * SaaS Vala Enterprise - Secure Download API
 * Secure file delivery with license validation
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { randomUUID } from 'crypto';

export const Route = createFileRoute('/api/products/$productId/download')({
  POST: async ({ request, params }) => {
    const logger = Logger.createRequestLogger('download-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const body = await request.json();
      const versionId = body.versionId;

      logger.info('Processing download request', { userId: auth.userId, productId: params.productId });

      // Check if user has a valid license for this product
      const license = await prisma.license.findFirst({
        where: {
          userId: auth.userId,
          productId: params.productId,
          status: 'ACTIVE',
        },
      });

      if (!license) {
        return Response.json(
          { error: 'No valid license found for this product' },
          { status: 403 }
        );
      }

      // Check if license has expired
      if (license.expiresAt && license.expiresAt < new Date()) {
        return Response.json(
          { error: 'License has expired' },
          { status: 403 }
        );
      }

      // Get the product version
      const productVersion = await prisma.productVersion.findFirst({
        where: {
          productId: params.productId,
          ...(versionId ? { id: versionId } : {}),
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!productVersion) {
        return Response.json(
          { error: 'No version available for download' },
          { status: 404 }
        );
      }

      // Generate signed download URL (in production, use cloud storage signed URLs)
      const downloadToken = randomUUID();
      const downloadUrl = `${productVersion.downloadUrl}?token=${downloadToken}`;

      // Record download
      await prisma.download.create({
        data: {
          userId: auth.userId,
          productId: params.productId,
          licenseId: license.id,
          versionId: productVersion.id,
          downloadUrl,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        },
      });

      logger.info('Download processed successfully', { 
        userId: auth.userId, 
        productId: params.productId,
        licenseId: license.id,
      });

      return Response.json({
        downloadUrl,
        version: productVersion.version,
        fileName: `${params.productId}-${productVersion.version}.zip`,
        fileSize: productVersion.fileSize,
      });
    } catch (error: any) {
      if (error.message === 'No authentication token provided') {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      logger.error('Failed to process download', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
