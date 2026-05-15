// @ts-nocheck
/**
 * SaaS Vala Enterprise - License Activation API
 * Online license activation
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const activateLicenseSchema = z.object({
  licenseKey: z.string(),
  deviceId: z.string(),
  deviceFingerprint: z.string().optional(),
  deviceName: z.string().optional(),
});

export const Route = createFileRoute('/api/licenses/activate')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const logger = Logger.createRequestLogger('license-activation-api');

        try {
          const body = await request.json();
          const validatedData = activateLicenseSchema.parse(body);

          logger.info('Activating license', { licenseKey: validatedData.licenseKey });

          // Find license
          const license = await prisma.license.findUnique({
            where: { licenseKey: validatedData.licenseKey },
            include: {
              product: true,
            },
          });

          if (!license) {
            logger.warn('License not found', { licenseKey: validatedData.licenseKey });
            return Response.json(
              { success: false, error: 'Invalid license key' },
              { status: 200 }
            );
          }

          // Check license status
          if (license.status !== 'ACTIVE') {
            logger.warn('License not active', { licenseKey: validatedData.licenseKey, status: license.status });
            return Response.json(
              { success: false, error: 'License is not active' },
              { status: 200 }
            );
          }

          // Check expiry
          if (license.expiresAt && license.expiresAt < new Date()) {
            logger.warn('License expired', { licenseKey: validatedData.licenseKey, expiresAt: license.expiresAt });
            return Response.json(
              { success: false, error: 'License has expired' },
              { status: 200 }
            );
          }

          // Check device binding
          if (license.deviceId && license.deviceId !== validatedData.deviceId) {
            logger.warn('Device mismatch', { 
              licenseKey: validatedData.licenseKey, 
              deviceId: validatedData.deviceId, 
              boundDevice: license.deviceId 
            });
            return Response.json(
              { success: false, error: 'License is already bound to a different device' },
              { status: 200 }
            );
          }

          // Bind device
          const updatedLicense = await prisma.license.update({
            where: { id: license.id },
            data: {
              deviceId: validatedData.deviceId,
              deviceFingerprint: validatedData.deviceFingerprint,
              metadata: {
                ...license.metadata,
                deviceName: validatedData.deviceName,
              },
              lastActivatedAt: new Date(),
            },
          });

          logger.info('License activated successfully', { licenseKey: validatedData.licenseKey, deviceId: validatedData.deviceId });

          return Response.json({
            success: true,
            license: {
              id: updatedLicense.id,
              licenseKey: updatedLicense.licenseKey,
              product: {
                id: updatedLicense.product.id,
                name: updatedLicense.product.name,
                slug: updatedLicense.product.slug,
              },
              expiresAt: updatedLicense.expiresAt,
              deviceId: updatedLicense.deviceId,
            },
          });
        } catch (error: any) {
          if (error instanceof z.ZodError) {
            return Response.json(
              { success: false, error: 'Validation error', details: error.errors },
              { status: 400 }
            );
          }

          logger.error('Failed to activate license', error);

          return Response.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
          );
        }
      },
    },
  },
});
