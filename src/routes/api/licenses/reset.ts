/**
 * SaaS Vala Enterprise - License Reset API
 * License reset and device unbinding
 */

import { createFileRoute } from '@tanstack/react-router';
import { prisma } from '@/lib/db';
import { AuthMiddleware } from '@/lib/middleware';
import { Logger } from '@/lib/logger';
import { z } from 'zod';

const resetLicenseSchema = z.object({
  reason: z.string(),
});

export const Route = createFileRoute('/api/licenses/reset')({
  POST: async ({ request, params }) => {
    const logger = Logger.createRequestLogger('license-reset-api');

    try {
      const auth = await AuthMiddleware.authenticate(request);
      const body = await request.json();
      const validatedData = resetLicenseSchema.parse(body);

      logger.info('Resetting license', { userId: auth.userId, licenseId: params.licenseId });

      // Check if user owns the license
      const license = await prisma.license.findUnique({
        where: { id: params.licenseId },
      });

      if (!license) {
        return Response.json(
          { error: 'License not found' },
          { status: 404 }
        );
      }

      // Only super admin or license owner can reset
      if (license.userId !== auth.userId && !auth.isSuperAdmin) {
        return Response.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }

      // Reset license (unbind device)
      const updatedLicense = await prisma.license.update({
        where: { id: params.licenseId },
        data: {
          deviceId: null,
          deviceFingerprint: null,
          lastResetAt: new Date(),
          metadata: {
            ...license.metadata,
            resetReason: validatedData.reason,
            resetBy: auth.userId,
            resetAt: new Date().toISOString(),
          },
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          userId: auth.userId,
          action: 'license.reset',
          entity: 'license',
          entityId: params.licenseId,
          metadata: {
            reason: validatedData.reason,
          },
        },
      });

      logger.info('License reset successfully', { licenseId: params.licenseId });

      return Response.json({ license: updatedLicense });
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

      logger.error('Failed to reset license', error);

      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
});
