// @ts-nocheck
/**
 * SaaS Vala Enterprise - Audit Service
 * Enterprise audit logging for security and compliance
 */

import { prisma } from './db';
// Stubbed enum (prisma client not generated in this env)
const AuditSeverity = { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH', CRITICAL: 'CRITICAL' } as const;
type AuditSeverity = typeof AuditSeverity[keyof typeof AuditSeverity];

export interface AuditLogData {
  userId?: string;
  companyId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  severity?: AuditSeverity;
}

export class AuditService {
  /**
   * Log audit event
   */
  static async log(data: AuditLogData): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: data.userId,
          companyId: data.companyId,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          metadata: data.metadata as any,
          severity: data.severity || AuditSeverity.INFO,
        },
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw - audit logging failures shouldn't break the application
    }
  }

  /**
   * Get audit logs for user
   */
  static async getUserLogs(userId: string, limit: number = 100) {
    return prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get audit logs for company
   */
  static async getCompanyLogs(companyId: string, limit: number = 100) {
    return prisma.auditLog.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get audit logs by action
   */
  static async getLogsByAction(action: string, limit: number = 100) {
    return prisma.auditLog.findMany({
      where: { action },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get audit logs by resource
   */
  static async getLogsByResource(resource: string, resourceId?: string, limit: number = 100) {
    return prisma.auditLog.findMany({
      where: {
        resource,
        resourceId,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get critical security events
   */
  static async getCriticalEvents(limit: number = 100) {
    return prisma.auditLog.findMany({
      where: {
        severity: AuditSeverity.CRITICAL,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}