// @ts-nocheck
/**
 * SaaS Vala Enterprise - License Validation API
 * Secure license validation for offline/online activation
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { Logger } from '@/lib/logger';

export const Route = createFileRoute('/api/licenses/validate')({
  POST: async ({ request }) => {
    const logger = Logger.createRequestLogger('license-validation-api');

    try {
      const body = await request.json();
      const { licenseKey, deviceId, deviceFingerprint } = body;

      logger.info('Validating license', { licenseKey, deviceId });

      if (!licenseKey) {
        return Response.json(
          { error: 'License key is required' },
          { status: 400 }
        );
      }

      // Find license
      const license = await prisma.license.findUnique({
        where: { licenseKey },
        include: {
          product: true,
          user: true,
        },
      });

      if (!license) {
        logger.warn('License not found', { licenseKey });
        return Response.json(
          { valid: false, error: 'Invalid license key' },
          { status: 200 }
        );
      }

      // Check license status
      if (license.status !== 'ACTIVE') {
        logger.warn('License not active', { licenseKey, status: license.status });
        return Response.json(
          { valid: false, error: 'License is not active' },
          { status: 200 }
        );
      }

      // Check expiry
      if (license.expiresAt && license.expiresAt < new Date()) {
        logger.warn('License expired', { licenseKey, expiresAt: license.expiresAt });
        return Response.json(
          { valid: false, error: 'License has expired' },
          { status: 200 }
        );
      }

      // Check device binding (if deviceId is provided)
      if (deviceId && license.deviceId && license.deviceId !== deviceId) {
        logger.warn('Device mismatch', { licenseKey, deviceId, boundDevice: license.deviceId });
        return Response.json(
          { valid: false, error: 'License is bound to a different device' },
          { status: 200 }
        );
      }

      // Bind device if not already bound
      if (deviceId && !license.deviceId) {
        await prisma.license.update({
          where: { id: license.id },
          data: {
            deviceId,
            deviceFingerprint,
            lastActivatedAt: new Date(),
          },
        });

        logger.info('License bound to device', { licenseKey, deviceId });
      }

      // Update last validated timestamp
      await prisma.license.update({
        where: { id: license.id },
        data: {
          lastValidatedAt: new Date(),
        },
      });

      logger.info('License validated successfully', { licenseKey });

      return Response.json({
        valid: true,
        license: {
          id: license.id,
          licenseKey: license.licenseKey,
          product: {
            id: license.product.id,
            name: license.product.name,
            slug: license.product.slug,
          },
          user: {
            id: license.user.id,
            email: license.user.email,
          },
          expiresAt: license.expiresAt,
          deviceId: license.deviceId,
        },
      });
    } catch (error: any) {
      logger.error('Failed to validate license', error);

      return Response.json(
        { valid: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
