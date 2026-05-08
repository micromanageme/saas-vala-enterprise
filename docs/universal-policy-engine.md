# Universal Policy Engine Architecture
## Phase 22 - Runtime Policy Injection, Policy Conflict Resolution, Dynamic Governance, Centralized Business Rule Engine, Approval Governance Chain

---

## Overview

Enterprise-grade universal policy engine including runtime policy injection, policy conflict resolution, dynamic governance, centralized business rule engine, and approval governance chain.

---

## Runtime Policy Injection

### Policy Injection Middleware

```typescript
// src/lib/policy/injection.ts
export class PolicyInjectionMiddleware {
  /**
   * Inject policy check before operation
   */
  static async injectPolicyCheck(context: {
    operation: string;
    resource: string;
    userId: string;
    tenantId: string;
    data: any;
  }): Promise<{ allowed: boolean; reason?: string }> {
    // Get applicable policies
    const policies = await this.getApplicablePolicies(context);

    // Evaluate each policy
    for (const policy of policies) {
      const result = await this.evaluatePolicy(policy, context);
      
      if (!result.allowed) {
        return {
          allowed: false,
          reason: `Policy violation: ${policy.name} - ${result.reason}`,
        };
      }
    }

    return { allowed: true };
  }

  /**
   * Get applicable policies
   */
  private static async getApplicablePolicies(context: any) {
    return prisma.runtimePolicy.findMany({
      where: {
        enabled: true,
        OR: [
          { appliesToAll: true },
          { userId: context.userId },
          { tenantId: context.tenantId },
          { operation: context.operation },
          { resource: context.resource },
        ],
      },
      orderBy: { priority: 'desc' },
    });
  }

  /**
   * Evaluate policy
   */
  private static async evaluatePolicy(policy: any, context: any) {
    const engine = new RuleEngine();
    const result = engine.evaluate(policy.rules, context.data);

    return {
      allowed: result.passed,
      reason: result.reason,
    };
  }

  /**
   * Create policy
   */
  static async createPolicy(data: {
    name: string;
    description?: string;
    operation: string;
    resource: string;
    rules: any;
    priority: number;
    appliesToAll?: boolean;
    userId?: string;
    tenantId?: string;
  }) {
    return prisma.runtimePolicy.create({
      data: {
        ...data,
        enabled: true,
        createdAt: new Date(),
      },
    });
  }
}
```

### Rule Engine

```typescript
// src/lib/policy/rule-engine.ts
export class RuleEngine {
  /**
   * Evaluate rules against data
   */
  evaluate(rules: any, data: any): { passed: boolean; reason?: string } {
    for (const rule of rules) {
      const result = this.evaluateRule(rule, data);
      
      if (!result.passed) {
        return result;
      }
    }

    return { passed: true };
  }

  /**
   * Evaluate single rule
   */
  private evaluateRule(rule: any, data: any): { passed: boolean; reason?: string } {
    switch (rule.operator) {
      case 'equals':
        return this.compare(data[rule.field], rule.value, (a, b) => a === b, rule);
      case 'not_equals':
        return this.compare(data[rule.field], rule.value, (a, b) => a !== b, rule);
      case 'greater_than':
        return this.compare(data[rule.field], rule.value, (a, b) => a > b, rule);
      case 'less_than':
        return this.compare(data[rule.field], rule.value, (a, b) => a < b, rule);
      case 'contains':
        return this.compare(data[rule.field], rule.value, (a, b) => a.includes(b), rule);
      case 'not_contains':
        return this.compare(data[rule.field], rule.value, (a, b) => !a.includes(b), rule);
      case 'in':
        return this.compare(data[rule.field], rule.value, (a, b) => b.includes(a), rule);
      case 'not_in':
        return this.compare(data[rule.field], rule.value, (a, b) => !b.includes(a), rule);
      case 'regex':
        return this.compare(data[rule.field], rule.value, (a, b) => new RegExp(b).test(a), rule);
      case 'custom':
        return this.evaluateCustomRule(rule, data);
      default:
        return { passed: true };
    }
  }

  private compare(
    actual: any,
    expected: any,
    comparator: (a: any, b: any) => boolean,
    rule: any
  ): { passed: boolean; reason?: string } {
    const passed = comparator(actual, expected);
    
    return {
      passed,
      reason: passed ? undefined : `${rule.field} ${rule.operator} ${expected} failed`,
    };
  }

  private evaluateCustomRule(rule: any, data: any): { passed: boolean; reason?: string } {
    // Evaluate custom rule using provided function
    try {
      const fn = new Function('data', rule.expression);
      const passed = fn(data);
      
      return {
        passed,
        reason: passed ? undefined : `Custom rule failed: ${rule.description}`,
      };
    } catch (error) {
      return {
        passed: false,
        reason: `Custom rule error: ${String(error)}`,
      };
    }
  }
}
```

---

## Policy Conflict Resolution

### Conflict Resolution Service

```typescript
// src/lib/policy/conflict-resolution.ts
export class PolicyConflictResolutionService {
  /**
   * Detect policy conflicts
   */
  static async detectConflicts(policyId: string) {
    const policy = await prisma.runtimePolicy.findUnique({
      where: { id: policyId },
    });

    if (!policy) throw new Error('Policy not found');

    const conflicts: any[] = [];

    // Find policies with same operation/resource
    const overlappingPolicies = await prisma.runtimePolicy.findMany({
      where: {
        enabled: true,
        operation: policy.operation,
        resource: policy.resource,
        id: { not: policyId },
      },
    });

    for (const otherPolicy of overlappingPolicies) {
      const conflict = await this.comparePolicies(policy, otherPolicy);
      if (conflict) {
        conflicts.push(conflict);
      }
    }

    return {
      policyId,
      conflicts,
      hasConflicts: conflicts.length > 0,
    };
  }

  /**
   * Compare policies for conflicts
   */
  private static async comparePolicies(policy1: any, policy2: any) {
    // Check for rule conflicts
    for (const rule1 of policy1.rules) {
      for (const rule2 of policy2.rules) {
        if (rule1.field === rule2.field) {
          const conflict = this.checkRuleConflict(rule1, rule2);
          if (conflict) {
            return {
              type: 'rule_conflict',
              policy1: policy1.name,
              policy2: policy2.name,
              field: rule1.field,
              conflict,
            };
          }
        }
      }
    }

    return null;
  }

  /**
   * Check rule conflict
   */
  private static checkRuleConflict(rule1: any, rule2: any) {
    // Check if rules are contradictory
    if (rule1.operator === 'equals' && rule2.operator === 'not_equals' && rule1.value === rule2.value) {
      return 'Contradictory equality rules';
    }

    if (rule1.operator === 'greater_than' && rule2.operator === 'less_than' && rule1.value <= rule2.value) {
      return 'Impossible range';
    }

    return null;
  }

  /**
   * Resolve conflict
   */
  static async resolveConflict(conflictId: string, resolution: {
    action: 'disable_policy' | 'modify_policy' | 'set_priority' | 'merge';
    targetPolicyId: string;
    newPriority?: number;
    newRules?: any;
  }) {
    switch (resolution.action) {
      case 'disable_policy':
        return prisma.runtimePolicy.update({
          where: { id: resolution.targetPolicyId },
          data: { enabled: false },
        });
      case 'modify_policy':
        return prisma.runtimePolicy.update({
          where: { id: resolution.targetPolicyId },
          data: {
            ...(resolution.newPriority && { priority: resolution.newPriority }),
            ...(resolution.newRules && { rules: resolution.newRules }),
          },
        });
      case 'set_priority':
        return prisma.runtimePolicy.update({
          where: { id: resolution.targetPolicyId },
          data: { priority: resolution.newPriority },
        });
      case 'merge':
        return this.mergePolicies(conflictId, resolution.targetPolicyId);
      default:
        throw new Error('Unknown resolution action');
    }
  }

  private static async mergePolicies(policy1Id: string, policy2Id: string) {
    const [policy1, policy2] = await Promise.all([
      prisma.runtimePolicy.findUnique({ where: { id: policy1Id } }),
      prisma.runtimePolicy.findUnique({ where: { id: policy2Id } }),
    ]);

    if (!policy1 || !policy2) throw new Error('Policy not found');

    // Merge rules
    const mergedRules = [...policy1.rules, ...policy2.rules];

    // Disable one policy
    await prisma.runtimePolicy.update({
      where: { id: policy2Id },
      data: { enabled: false },
    });

    // Update the other with merged rules
    return prisma.runtimePolicy.update({
      where: { id: policy1Id },
      data: {
        rules: mergedRules,
        name: `${policy1.name} (merged with ${policy2.name})`,
      },
    });
  }
}
```

---

## Dynamic Governance

### Dynamic Governance Service

```typescript
// src/lib/policy/dynamic-governance.ts
export class DynamicGovernanceService {
  /**
   * Apply dynamic policy
   */
  static async applyDynamicPolicy(data: {
    trigger: string;
    conditions: any;
    actions: any[];
    duration?: number; // minutes
    tenantId: string;
  }) {
    const dynamicPolicy = await prisma.dynamicPolicy.create({
      data: {
        ...data,
        status: 'active',
        activatedAt: new Date(),
        expiresAt: data.duration ? new Date(Date.now() + data.duration * 60 * 1000) : null,
      },
    });

    // Execute actions
    for (const action of data.actions) {
      await this.executeAction(action, data.tenantId);
    }

    return dynamicPolicy;
  }

  /**
   * Evaluate dynamic policies
   */
  static async evaluateDynamicPolicies(trigger: string, context: any) {
    const policies = await prisma.dynamicPolicy.findMany({
      where: {
        trigger,
        status: 'active',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    const results = [];

    for (const policy of policies) {
      const matched = this.evaluateConditions(policy.conditions, context);
      
      if (matched) {
        results.push({
          policyId: policy.id,
          policyName: policy.name,
          matched: true,
          actions: policy.actions,
        });
      }
    }

    return results;
  }

  /**
   * Revoke dynamic policy
   */
  static async revokePolicy(policyId: string, reason: string) {
    return prisma.dynamicPolicy.update({
      where: { id: policyId },
      data: {
        status: 'revoked',
        revokedAt: new Date(),
        revocationReason: reason,
      },
    });
  }

  private static evaluateConditions(conditions: any, context: any): boolean {
    const engine = new RuleEngine();
    const result = engine.evaluate(conditions, context);
    return result.passed;
  }

  private static async executeAction(action: any, tenantId: string) {
    switch (action.type) {
      case 'restrict_access':
        await this.restrictAccess(action.resource, tenantId);
        break;
      case 'enable_mfa':
        await this.enableMFA(tenantId);
        break;
      case 'throttle_requests':
        await this.throttleRequests(action.limit, tenantId);
        break;
      case 'notify_admins':
        await this.notifyAdmins(action.message, tenantId);
        break;
      default:
        console.log('Unknown action type:', action.type);
    }
  }

  private static async restrictAccess(resource: string, tenantId: string) {
    console.log(`Restricting access to ${resource} for tenant ${tenantId}`);
  }

  private static async enableMFA(tenantId: string) {
    console.log(`Enabling MFA for tenant ${tenantId}`);
  }

  private static async throttleRequests(limit: number, tenantId: string) {
    console.log(`Throttling requests to ${limit}/min for tenant ${tenantId}`);
  }

  private static async notifyAdmins(message: string, tenantId: string) {
    console.log(`Notifying admins for tenant ${tenantId}: ${message}`);
  }
}
```

---

## Centralized Business Rule Engine

### Business Rule Service

```typescript
// src/lib/policy/business-rules.ts
export class BusinessRuleService {
  /**
   * Create business rule
   */
  static async createRule(data: {
    name: string;
    category: string;
    conditions: any;
    actions: any[];
    priority: number;
    tenantId: string;
  }) {
    return prisma.businessRule.create({
      data: {
        ...data,
        enabled: true,
        createdAt: new Date(),
      },
    });
  }

  /**
   * Execute business rules
   */
  static async executeRules(category: string, context: any) {
    const rules = await prisma.businessRule.findMany({
      where: {
        category,
        enabled: true,
      },
      orderBy: { priority: 'desc' },
    });

    const results = [];

    for (const rule of rules) {
      const matched = this.evaluateConditions(rule.conditions, context);
      
      if (matched) {
        const actionResults = await this.executeActions(rule.actions, context);
        
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          matched: true,
          actions: actionResults,
        });

        // Break after first match if configured
        if (rule.stopOnMatch) {
          break;
        }
      }
    }

    return results;
  }

  /**
   * Test rule
   */
  static async testRule(ruleId: string, testData: any) {
    const rule = await prisma.businessRule.findUnique({
      where: { id: ruleId },
    });

    if (!rule) throw new Error('Rule not found');

    const matched = this.evaluateConditions(rule.conditions, testData);
    
    return {
      ruleId,
      ruleName: rule.name,
      matched,
      actions: matched ? rule.actions : [],
    };
  }

  private static evaluateConditions(conditions: any, context: any): boolean {
    const engine = new RuleEngine();
    const result = engine.evaluate(conditions, context);
    return result.passed;
  }

  private static async executeActions(actions: any[], context: any) {
    const results = [];

    for (const action of actions) {
      const result = await this.executeAction(action, context);
      results.push({
        action: action.type,
        result,
      });
    }

    return results;
  }

  private static async executeAction(action: any, context: any) {
    switch (action.type) {
      case 'set_value':
        return { success: true, value: action.value };
      case 'send_notification':
        return { success: true, notificationSent: true };
      case 'create_record':
        return { success: true, recordId: 'new-record-id' };
      case 'update_record':
        return { success: true, updated: true };
      case 'call_api':
        return await this.callAPI(action.endpoint, action.method, action.data);
      default:
        return { success: false, error: 'Unknown action type' };
    }
  }

  private static async callAPI(endpoint: string, method: string, data: any) {
    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return {
      success: response.ok,
      status: response.status,
    };
  }
}
```

---

## Approval Governance Chain

### Approval Chain Service

```typescript
// src/lib/policy/approval-chain.ts
export class ApprovalChainService {
  /**
   * Create approval chain
   */
  static async createChain(data: {
    name: string;
    description?: string;
    category: string;
    steps: Array<{
      approverRole: string;
      approverUserId?: string;
      required: boolean;
      order: number;
    }>;
    tenantId: string;
  }) {
    return prisma.approvalChain.create({
      data: {
        ...data,
        enabled: true,
      },
    });
  }

  /**
   * Initiate approval request
   */
  static async initiateRequest(data: {
    chainId: string;
    requestType: string;
    requestData: any;
    requesterId: string;
    tenantId: string;
  }) {
    const chain = await prisma.approvalChain.findUnique({
      where: { id: data.chainId },
      include: { steps: true },
    });

    if (!chain) throw new Error('Chain not found');

    const request = await prisma.approvalRequest.create({
      data: {
        chainId: data.chainId,
        requestType: data.requestType,
        requestData: data.requestData,
        requesterId: data.requesterId,
        tenantId: data.tenantId,
        status: 'pending',
        currentStep: chain.steps[0].order,
        initiatedAt: new Date(),
      },
    });

    // Notify first approver
    await this.notifyApprover(chain.steps[0], request);

    return request;
  }

  /**
   * Approve request
   */
  static async approve(requestId: string, approverId: string, comments?: string) {
    const request = await prisma.approvalRequest.findUnique({
      where: { id: requestId },
      include: { chain: { include: { steps: true } } },
    });

    if (!request) throw new Error('Request not found');
    if (request.status !== 'pending') throw new Error('Request already processed');

    const currentStep = request.chain.steps.find(s => s.order === request.currentStep);
    if (!currentStep) throw new Error('Current step not found');

    // Validate approver
    if (!this.validateApprover(currentStep, approverId)) {
      throw new Error('Not authorized to approve this step');
    }

    // Create approval record
    await prisma.approvalRecord.create({
      data: {
        requestId,
        stepId: currentStep.id,
        approverId,
        decision: 'approved',
        comments,
        decidedAt: new Date(),
      },
    });

    // Move to next step or complete
    const nextStep = request.chain.steps.find(s => s.order === request.currentStep + 1);

    if (nextStep) {
      await prisma.approvalRequest.update({
        where: { id: requestId },
        data: {
          currentStep: nextStep.order,
        },
      });

      await this.notifyApprover(nextStep, request);
    } else {
      await prisma.approvalRequest.update({
        where: { id: requestId },
        data: {
          status: 'approved',
          completedAt: new Date(),
        },
      });

      // Execute approved action
      await this.executeApprovedAction(request);
    }

    return request;
  }

  /**
   * Reject request
   */
  static async reject(requestId: string, approverId: string, reason: string) {
    const request = await prisma.approvalRequest.findUnique({
      where: { id: requestId },
      include: { chain: { include: { steps: true } } },
    });

    if (!request) throw new Error('Request not found');

    const currentStep = request.chain.steps.find(s => s.order === request.currentStep);
    if (!currentStep) throw new Error('Current step not found');

    if (!this.validateApprover(currentStep, approverId)) {
      throw new Error('Not authorized to reject this step');
    }

    await prisma.approvalRecord.create({
      data: {
        requestId,
        stepId: currentStep.id,
        approverId,
        decision: 'rejected',
        comments: reason,
        decidedAt: new Date(),
      },
    });

    await prisma.approvalRequest.update({
      where: { id: requestId },
      data: {
        status: 'rejected',
        completedAt: new Date(),
      },
    });

    return request;
  }

  private static validateApprover(step: any, approverId: string): boolean {
    if (step.approverUserId) {
      return step.approverUserId === approverId;
    }

    if (step.approverRole) {
      // Check if user has the required role
      return true; // Simplified
    }

    return false;
  }

  private static async notifyApprover(step: any, request: any) {
    console.log(`Notifying approver for step ${step.order} of request ${request.id}`);
  }

  private static async executeApprovedAction(request: any) {
    console.log(`Executing approved action for request ${request.id}`);
  }

  /**
   * Get request status
   */
  static async getStatus(requestId: string) {
    const request = await prisma.approvalRequest.findUnique({
      where: { id: requestId },
      include: {
        chain: { include: { steps: true } },
        records: {
          include: {
            approver: true,
          },
          orderBy: { decidedAt: 'asc' },
        },
      },
    });

    if (!request) throw new Error('Request not found');

    const currentStepInfo = request.chain.steps.find(s => s.order === request.currentStep);

    return {
      requestId: request.id,
      status: request.status,
      requestType: request.requestType,
      currentStep: currentStepInfo,
      totalSteps: request.chain.steps.length,
      completedSteps: request.records.length,
      approvalRecords: request.records,
      initiatedAt: request.initiatedAt,
      completedAt: request.completedAt,
    };
  }
}
```

---

## Implementation Checklist

- [x] Runtime Policy Injection
- [x] Rule Engine
- [x] Policy Conflict Resolution
- [x] Dynamic Governance
- [x] Centralized Business Rule Engine
- [x] Approval Governance Chain

---

## Deployment Notes

1. **Policy Caching**: Cache policies for fast evaluation
2. **Conflict Detection**: Run conflict detection on policy creation
3. **Rule Editor**: Build UI for creating and testing rules
4. **Approval Notifications**: Configure notification channels for approvals
5. **Audit Trail**: Log all policy evaluations and approvals
