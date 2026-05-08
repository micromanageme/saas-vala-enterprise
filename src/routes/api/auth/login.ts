/**
 * SaaS Vala Enterprise - API: Authentication
 * Login endpoint with JWT token generation
 */

import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { JWTService, PasswordService, SessionService } from '@/lib/auth';
import { RBACService } from '@/lib/rbac';
import { AuditService } from '@/lib/audit';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  deviceFingerprint: z.string().optional(),
  deviceType: z.enum(['DESKTOP', 'LAPTOP', 'TABLET', 'MOBILE', 'UNKNOWN']).optional(),
  deviceName: z.string().optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
  userAgent: z.string().optional(),
});

export const Route = createFileRoute('/api/auth/login')({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const validatedData = loginSchema.parse(body);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: validatedData.email.toLowerCase() },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        return Response.json(
          { error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
          { status: 401 }
        );
      }

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        return Response.json(
          { error: 'Account is not active', code: 'ACCOUNT_INACTIVE' },
          { status: 403 }
        );
      }

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        return Response.json(
          { error: 'Account is temporarily locked', code: 'ACCOUNT_LOCKED' },
          { status: 423 }
        );
      }

      // Verify password
      const isValidPassword = await PasswordService.verifyPassword(
        validatedData.password,
        user.passwordHash!
      );

      if (!isValidPassword) {
        // Increment failed login attempts
        const failedAttempts = user.failedLoginAttempts + 1;
        const lockedUntil = failedAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null; // Lock for 15 minutes after 5 attempts

        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: failedAttempts,
            lockedUntil,
          },
        });

        return Response.json(
          { error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
          { status: 401 }
        );
      }

      // Reset failed login attempts on successful login
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastLoginAt: new Date(),
          lastLoginIp: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        },
      });

      // Get user roles
      const roles = user.roles
        .filter((ur) => ur.isActive && (!ur.expiresAt || ur.expiresAt > new Date()))
        .map((ur) => ur.role.slug);

      // Create session
      const session = await SessionService.createSession({
        userId: user.id,
        deviceFingerprint: validatedData.deviceFingerprint,
        deviceType: validatedData.deviceType,
        deviceName: validatedData.deviceName,
        browser: validatedData.browser,
        os: validatedData.os,
        userAgent: validatedData.userAgent,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      });

      // Generate JWT tokens
      const tokens = JWTService.generateTokenPair({
        userId: user.id,
        email: user.email,
        companyId: user.companyId || undefined,
        roles,
        workspaceId: user.defaultWorkspaceId || undefined,
        sessionId: session.sessionId,
      });

      // Invalidate RBAC cache for user
      RBACService.invalidateCache(user.id);

      // Audit log
      await AuditService.log({
        userId: user.id,
        companyId: user.companyId || undefined,
        action: 'user.login',
        resource: 'sessions',
        resourceId: session.sessionId,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: validatedData.userAgent,
        metadata: {
          deviceType: validatedData.deviceType,
          deviceName: validatedData.deviceName,
        },
      });

      return Response.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            avatar: user.avatar,
            companyId: user.companyId,
            defaultWorkspaceId: user.defaultWorkspaceId,
            roles,
            isSuperAdmin: user.isSuperAdmin,
          },
          tokens,
          session: {
            id: session.sessionId,
            expiresAt: session.expiresAt,
          },
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { error: 'Validation error', details: error.errors, code: 'VALIDATION_ERROR' },
          { status: 400 }
        );
      }

      console.error('Login error:', error);
      return Response.json(
        { error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }
  },
});
