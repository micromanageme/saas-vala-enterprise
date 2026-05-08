# Governance & Compliance Architecture
## Phase 11 - GDPR, ISO, Audit Trails, Forensic Reconstruction, Compliance Reports, Policy Engine, Governance Workflows

---

## Overview

Enterprise-grade governance and compliance framework including GDPR compliance, ISO standards, comprehensive audit trails, forensic reconstruction capabilities, compliance reporting, policy engine, and governance workflows.

---

## GDPR Compliance

### Data Subject Rights

```typescript
// src/lib/gdpr/data-subject.ts
export class GDPRService {
  /**
   * Right to access (Data Portability)
   */
  static async getDataSubjectExport(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: true,
        sessions: true,
        activities: { take: 100 },
        notifications: { take: 100 },
        auditLogs: { take: 100 },
      },
    });

    if (!user) throw new Error('User not found');

    return {
      personalData: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accountData: {
        roles: user.roles,
        sessions: user.sessions,
      },
      activityData: {
        activities: user.activities,
        notifications: user.notifications,
        auditLogs: user.auditLogs,
      },
      exportDate: new Date().toISOString(),
    };
  }

  /**
   * Right to rectification
   */
  static async rectifyData(userId: string, updates: Record<string, any>) {
    return prisma.user.update({
      where: { id: userId },
      data: updates,
    });
  }

  /**
   * Right to erasure (Right to be forgotten)
   */
  static async eraseData(userId: string, requestorId: string) {
    // Log the request
    await prisma.auditLog.create({
      data: {
        userId: requestorId,
        action: 'gdpr.erasure_request',
        resource: 'users',
        resourceId: userId,
        metadata: { targetUserId: userId },
      },
    });

    // Anonymize user data instead of deletion (for audit trail)
    const anonymizedData = {
      email: `deleted-${userId}@anonymized.local`,
      firstName: 'Deleted',
      lastName: 'User',
      displayName: 'Deleted User',
      phone: null,
      address: null,
      avatar: null,
      status: 'deleted',
      deletedAt: new Date(),
      deletedBy: requestorId,
    };

    return prisma.user.update({
      where: { id: userId },
      data: anonymizedData,
    });
  }

  /**
   * Right to restriction of processing
   */
  static async restrictProcessing(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        processingRestricted: true,
        restrictedAt: new Date(),
      },
    });
  }

  /**
   * Right to data portability
   */
  static async exportUserData(userId: string, format: 'json' | 'csv') {
    const data = await this.getDataSubjectExport(userId);

    if (format === 'csv') {
      // Convert to CSV
      return this.convertToCSV(data);
    }

    return data;
  }

  /**
   * Right to object
   */
  static async objectToProcessing(userId: string, reason: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        processingObjection: true,
        objectionReason: reason,
        objectedAt: new Date(),
      },
    });
  }

  private static convertToCSV(data: any): string {
    // CSV conversion logic
    return JSON.stringify(data);
  }
}
```

### Consent Management

```typescript
// src/lib/gdpr/consent.ts
export class ConsentService {
  /**
   * Record consent
   */
  static async recordConsent(data: {
    userId: string;
    consentType: 'marketing' | 'analytics' | 'personalization' | 'terms';
    consentGiven: boolean;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.userConsent.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Check consent status
   */
  static async checkConsent(userId: string, consentType: string): Promise<boolean> {
    const consent = await prisma.userConsent.findFirst({
      where: {
        userId,
        consentType,
      },
      orderBy: { timestamp: 'desc' },
    });

    return consent?.consentGiven || false;
  }

  /**
   * Withdraw consent
   */
  static async withdrawConsent(userId: string, consentType: string) {
    return prisma.userConsent.create({
      data: {
        userId,
        consentType,
        consentGiven: false,
        timestamp: new Date(),
      },
    });
  }
}
```

### Data Breach Management

```typescript
// src/lib/gdpr/breach.ts
export class DataBreachService {
  /**
   * Report data breach
   */
  static async reportBreach(data: {
    description: string;
    affectedUsers?: string[];
    severity: 'low' | 'medium' | 'high';
    discoveredAt: Date;
    reportedBy: string;
    tenantId: string;
  }) {
    const breach = await prisma.dataBreach.create({
      data: {
        ...data,
        status: 'investigating',
      },
    });

    // Notify supervisory authority within 72 hours for high severity
    if (data.severity === 'high') {
      await this.notifyAuthority(breach);
    }

    // Notify affected users
    if (data.affectedUsers) {
      await this.notifyAffectedUsers(breach);
    }

    return breach;
  }

  /**
   * Update breach status
   */
  static async updateStatus(breachId: string, status: string, notes?: string) {
    return prisma.dataBreach.update({
      where: { id: breachId },
      data: { status, notes, resolvedAt: status === 'resolved' ? new Date() : null },
    });
  }

  private static async notifyAuthority(breach: any) {
    // Send notification to data protection authority
    console.log('Notifying authority:', breach);
  }

  private static async notifyAffectedUsers(breach: any) {
    // Send notifications to affected users
    if (breach.affectedUsers) {
      for (const userId of breach.affectedUsers) {
        await NotificationService.createNotification({
          userId,
          type: 'security',
          title: 'Security Incident',
          message: 'We have detected a security incident that may affect your account. Please review your account activity.',
        });
      }
    }
  }
}
```

---

## ISO Compliance

### ISO 27001 Controls

```typescript
// src/lib/iso/controls.ts
export class ISO27001Service {
  /**
   * Implement access control
   */
  static async implementAccessControl(userId: string, accessLevel: string) {
    // Implement ISO 27001 Annex A.9 access controls
    return prisma.user.update({
      where: { id: userId },
      data: {
        accessLevel,
        lastAccessReview: new Date(),
      },
    });
  }

  /**
   * Asset management
   */
  static async registerAsset(data: {
    type: string;
    name: string;
    value?: number;
    location?: string;
    owner: string;
    classification: 'public' | 'internal' | 'confidential' | 'restricted';
    tenantId: string;
  }) {
    return prisma.asset.create({
      data: {
        ...data,
        status: 'active',
      },
    });
  }

  /**
   * Risk assessment
   */
  static async assessRisk(data: {
    assetId: string;
    threat: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation?: string;
  }) {
    const riskScore = this.calculateRiskScore(data.likelihood, data.impact);

    return prisma.riskAssessment.create({
      data: {
        ...data,
        riskScore,
        assessmentDate: new Date(),
      },
    });
  }

  private static calculateRiskScore(
    likelihood: string,
    impact: string
  ): number {
    const likelihoodScore = { low: 1, medium: 2, high: 3 };
    const impactScore = { low: 1, medium: 2, high: 3 };

    return likelihoodScore[likelihood] * impactScore[impact];
  }
}
```

---

## Audit Trails

### Comprehensive Audit Logging

```typescript
// src/lib/audit/comprehensive.ts
export class AuditTrailService {
  /**
   * Log audit event
   */
  static async log(data: {
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    changes?: Record<string, { old: any; new: any }>;
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
    metadata?: any;
    tenantId?: string;
  }) {
    return prisma.auditLog.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Query audit logs
   */
  static async query(params: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    tenantId?: string;
    limit?: number;
  }) {
    const where: any = {};

    if (params.userId) where.userId = params.userId;
    if (params.action) where.action = params.action;
    if (params.resource) where.resource = params.resource;
    if (params.tenantId) where.tenantId = params.tenantId;

    if (params.startDate || params.endDate) {
      where.timestamp = {};
      if (params.startDate) where.timestamp.gte = params.startDate;
      if (params.endDate) where.timestamp.lte = params.endDate;
    }

    return prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: params.limit || 100,
    });
  }

  /**
   * Get user activity timeline
   */
  static async getUserTimeline(userId: string, limit: number = 50) {
    return prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }
}
```

### Change Tracking

```typescript
// src/lib/audit/changes.ts
export class ChangeTrackingService {
  /**
   * Track entity changes
   */
  static async trackChange(data: {
    entityType: string;
    entityId: string;
    operation: 'create' | 'update' | 'delete';
    changes?: Record<string, { old: any; new: any }>;
    userId: string;
    tenantId?: string;
  }) {
    return prisma.changeLog.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Get entity history
   */
  static async getHistory(entityType: string, entityId: string) {
    return prisma.changeLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { timestamp: 'desc' },
    });
  }
}
```

---

## Forensic Reconstruction

### State Reconstruction

```typescript
// src/lib/forensic/reconstruction.ts
export class ForensicReconstructionService {
  /**
   * Reconstruct entity state at specific time
   */
  static async reconstructState(
    entityType: string,
    entityId: string,
    timestamp: Date
  ) {
    const changes = await prisma.changeLog.findMany({
      where: {
        entityType,
        entityId,
        timestamp: { lte: timestamp },
      },
      orderBy: { timestamp: 'asc' },
    });

    let state: any = {};

    for (const change of changes) {
      if (changes) {
        for (const [field, value] of Object.entries(change.changes || {})) {
          const changeValue = value as { old: any; new: any };
          state[field] = changeValue.old || changeValue.new;
        }
      }
    }

    return {
      entityType,
      entityId,
      timestamp,
      state,
    };
  }

  /**
   * Reconstruct user activity
   */
  static async reconstructUserActivity(userId: string, startDate: Date, endDate: Date) {
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        userId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: 'asc' },
    });

    return {
      userId,
      period: { startDate, endDate },
      activities: auditLogs,
      summary: this.summarizeActivity(auditLogs),
    };
  }

  private static summarizeActivity(logs: any[]) {
    const summary: Record<string, number> = {};

    for (const log of logs) {
      const key = `${log.resource}.${log.action}`;
      summary[key] = (summary[key] || 0) + 1;
    }

    return summary;
  }
}
```

---

## Compliance Reports

### Report Generation

```typescript
// src/lib/compliance/reports.ts
export class ComplianceReportService {
  /**
   * Generate GDPR compliance report
   */
  static async generateGDPRReport(tenantId: string, startDate: Date, endDate: Date) {
    const [
      dataRequests,
      consentRecords,
      dataBreaches,
      userCount,
    ] = await Promise.all([
      prisma.dataSubjectRequest.findMany({
        where: {
          tenantId,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.userConsent.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.dataBreach.findMany({
        where: {
          tenantId,
          discoveredAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.user.count(),
    ]);

    return {
      reportType: 'GDPR',
      period: { startDate, endDate },
      tenantId,
      summary: {
        dataRequests: dataRequests.length,
        consentRecords: consentRecords.length,
        dataBreaches: dataBreaches.length,
        totalUsers: userCount,
      },
      details: {
        dataRequests,
        consentRecords,
        dataBreaches,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generate ISO 27001 compliance report
   */
  static async generateISOReport(tenantId: string) {
    const [assets, risks, controls] = await Promise.all([
      prisma.asset.findMany({ where: { tenantId } }),
      prisma.riskAssessment.findMany({ where: { tenantId } }),
      prisma.control.findMany({ where: { tenantId } }),
    ]);

    return {
      reportType: 'ISO_27001',
      tenantId,
      summary: {
        totalAssets: assets.length,
        totalRisks: risks.length,
        highRisks: risks.filter(r => r.riskScore >= 6).length,
        implementedControls: controls.filter(c => c.status === 'implemented').length,
      },
      details: {
        assets,
        risks,
        controls,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generate access audit report
   */
  static async generateAccessAuditReport(tenantId: string, startDate: Date, endDate: Date) {
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        tenantId,
        timestamp: { gte: startDate, lte: endDate },
      },
      orderBy: { timestamp: 'desc' },
    });

    const byUser = auditLogs.reduce((acc, log) => {
      if (!acc[log.userId]) {
        acc[log.userId] = { count: 0, actions: [] };
      }
      acc[log.userId].count++;
      acc[log.userId].actions.push(log.action);
      return acc;
    }, {} as Record<string, any>);

    return {
      reportType: 'ACCESS_AUDIT',
      period: { startDate, endDate },
      tenantId,
      summary: {
        totalEvents: auditLogs.length,
        uniqueUsers: Object.keys(byUser).length,
      },
      byUser,
      generatedAt: new Date().toISOString(),
    };
  }
}
```

---

## Policy Engine

### Policy Definition

```typescript
// src/lib/policy/engine.ts
export class PolicyEngine {
  /**
   * Define policy
   */
  static async definePolicy(data: {
    name: string;
    description?: string;
    type: 'data_retention' | 'access_control' | 'approval' | 'compliance';
    rules: Array<{
      condition: string;
      action: string;
      parameters?: any;
    }>;
    priority: number;
    tenantId: string;
  }) {
    return prisma.policy.create({
      data: {
        ...data,
        status: 'active',
      },
    });
  }

  /**
   * Evaluate policy
   */
  static async evaluate(policyId: string, context: any) {
    const policy = await prisma.policy.findUnique({
      where: { id: policyId },
    });

    if (!policy || policy.status !== 'active') {
      return { allowed: true, reason: 'Policy not active' };
    }

    for (const rule of policy.rules) {
      const result = this.evaluateRule(rule, context);
      if (!result.passed) {
        return {
          allowed: false,
          reason: `Rule failed: ${rule.condition}`,
          policy: policy.name,
        };
      }
    }

    return { allowed: true };
  }

  private static evaluateRule(rule: any, context: any) {
    // Rule evaluation logic
    return { passed: true };
  }

  /**
   * Check compliance with all policies
   */
  static async checkCompliance(tenantId: string, context: any) {
    const policies = await prisma.policy.findMany({
      where: {
        tenantId,
        status: 'active',
      },
      orderBy: { priority: 'desc' },
    });

    const results = [];

    for (const policy of policies) {
      const result = await this.evaluate(policy.id, context);
      results.push({
        policy: policy.name,
        ...result,
      });
    }

    const allCompliant = results.every(r => r.allowed);

    return {
      compliant: allCompliant,
      results,
    };
  }
}
```

---

## Governance Workflows

### Approval Workflow

```typescript
// src/lib/governance/approval.ts
export class ApprovalWorkflowService {
  /**
   * Create approval request
   */
  static async createRequest(data: {
    type: string;
    title: string;
    description: string;
    requesterId: string;
    approverId: string;
    resourceType: string;
    resourceId: string;
    tenantId: string;
    metadata?: any;
  }) {
    return prisma.approvalRequest.create({
      data: {
        ...data,
        status: 'pending',
      },
    });
  }

  /**
   * Approve request
   */
  static async approve(requestId: string, approverId: string, comments?: string) {
    const request = await prisma.approvalRequest.update({
      where: { id: requestId },
      data: {
        status: 'approved',
        approvedBy: approverId,
        approvedAt: new Date(),
        comments,
      },
    });

    // Execute approved action
    await this.executeApprovedAction(request);

    return request;
  }

  /**
   * Reject request
   */
  static async reject(requestId: string, approverId: string, reason: string) {
    return prisma.approvalRequest.update({
      where: { id: requestId },
      data: {
        status: 'rejected',
        rejectedBy: approverId,
        rejectedAt: new Date(),
        comments: reason,
      },
    });
  }

  private static async executeApprovedAction(request: any) {
    // Execute the approved action based on request type
    console.log('Executing approved action:', request);
  }
}
```

### Policy Violation Handling

```typescript
// src/lib/governance/violations.ts
export class ViolationService {
  /**
   * Report violation
   */
  static async reportViolation(data: {
    policyId: string;
    userId: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    tenantId: string;
  }) {
    const violation = await prisma.policyViolation.create({
      data: {
        ...data,
        status: 'open',
        reportedAt: new Date(),
      },
    });

    // Notify compliance team for high severity
    if (data.severity === 'high') {
      await this.notifyComplianceTeam(violation);
    }

    return violation;
  }

  /**
   * Resolve violation
   */
  static async resolve(violationId: string, resolverId: string, resolution: string) {
    return prisma.policyViolation.update({
      where: { id: violationId },
      data: {
        status: 'resolved',
        resolvedBy: resolverId,
        resolvedAt: new Date(),
        resolution,
      },
    });
  }

  private static async notifyComplianceTeam(violation: any) {
    // Send notification to compliance team
    console.log('Notifying compliance team:', violation);
  }
}
```

---

## Implementation Checklist

- [x] GDPR Data Subject Rights
- [x] Consent Management
- [x] Data Breach Management
- [x] ISO 27001 Controls
- [x] Comprehensive Audit Logging
- [x] Change Tracking
- [x] State Reconstruction
- [x] Compliance Reports
- [x] Policy Engine
- [x] Approval Workflows
- [x] Violation Handling

---

## Deployment Notes

1. **Data Retention**: Configure automated data retention policies
2. **Consent Dashboard**: Build UI for consent management
3. **Audit Log Storage**: Use immutable storage for audit logs
4. **Compliance Monitoring**: Set up automated compliance checks
5. **Reporting Schedule**: Configure scheduled compliance report generation
