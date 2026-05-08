// Universal Execution Engine - Execute workflows directly without browsing system structure
import type { EntityType, EntityState } from "./operational-state-machine";
import type { Priority } from "./system-priority-engine";

export type WorkflowType = 
  | 'create'
  | 'approve'
  | 'process'
  | 'assign'
  | 'complete'
  | 'escalate'
  | 'cancel'
  | 'retry'
  | 'custom';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  action: string;
  estimatedTime: string;
  requiresApproval: boolean;
  autoAdvance: boolean;
  conditions?: string[];
  sideEffects?: string[];
}

export interface WorkflowExecution {
  workflowId: string;
  workflowType: WorkflowType;
  entityType: EntityType;
  entityId: string;
  currentStep: number;
  steps: WorkflowStep[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  error?: string;
  context: Record<string, any>;
}

export interface ExecutionResult {
  success: boolean;
  workflowId: string;
  stepCompleted: number;
  totalSteps: number;
  status: string;
  nextStep?: WorkflowStep;
  sideEffects: string[];
  error?: string;
}

// Workflow definitions for each entity type and workflow type
export const workflowDefinitions: Record<EntityType, Record<WorkflowType, WorkflowStep[]>> = {
  order: {
    create: [
      {
        id: 'step-1',
        name: 'Select Customer',
        description: 'Select customer for order',
        action: 'select_customer',
        estimatedTime: '2 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-2',
        name: 'Select Products',
        description: 'Select products and quantities',
        action: 'select_products',
        estimatedTime: '5 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-3',
        name: 'Calculate Total',
        description: 'Calculate order total',
        action: 'calculate_total',
        estimatedTime: '1 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-4',
        name: 'Submit Order',
        description: 'Submit order for approval',
        action: 'submit',
        estimatedTime: '2 min',
        requiresApproval: false,
        autoAdvance: false,
      },
    ],
    approve: [
      {
        id: 'step-1',
        name: 'Review Order',
        description: 'Review order details',
        action: 'review',
        estimatedTime: '3 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-2',
        name: 'Check Credit',
        description: 'Check customer credit',
        action: 'check_credit',
        estimatedTime: '2 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-3',
        name: 'Approve Order',
        description: 'Approve order for processing',
        action: 'approve',
        estimatedTime: '1 min',
        requiresApproval: true,
        autoAdvance: false,
      },
    ],
    process: [
      {
        id: 'step-1',
        name: 'Reserve Inventory',
        description: 'Reserve inventory items',
        action: 'reserve_inventory',
        estimatedTime: '3 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-2',
        name: 'Generate Invoice',
        description: 'Generate invoice for order',
        action: 'generate_invoice',
        estimatedTime: '2 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-3',
        name: 'Schedule Shipment',
        description: 'Schedule shipment',
        action: 'schedule_shipment',
        estimatedTime: '5 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-4',
        name: 'Notify Customer',
        description: 'Notify customer of shipment',
        action: 'notify_customer',
        estimatedTime: '1 min',
        requiresApproval: false,
        autoAdvance: true,
      },
    ],
    assign: [
      {
        id: 'step-1',
        name: 'Select Assignee',
        description: 'Select person to assign to',
        action: 'select_assignee',
        estimatedTime: '2 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-2',
        name: 'Notify Assignee',
        description: 'Notify assignee of assignment',
        action: 'notify',
        estimatedTime: '1 min',
        requiresApproval: false,
        autoAdvance: false,
      },
    ],
    complete: [
      {
        id: 'step-1',
        name: 'Verify Completion',
        description: 'Verify all steps completed',
        action: 'verify',
        estimatedTime: '2 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-2',
        name: 'Update Status',
        description: 'Update entity status',
        action: 'update_status',
        estimatedTime: '1 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-3',
        name: 'Archive',
        description: 'Archive completed workflow',
        action: 'archive',
        estimatedTime: '1 min',
        requiresApproval: false,
        autoAdvance: false,
      },
    ],
    escalate: [
      {
        id: 'step-1',
        name: 'Select Escalation Level',
        description: 'Select escalation target',
        action: 'select_level',
        estimatedTime: '2 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-2',
        name: 'Document Issue',
        description: 'Document escalation reason',
        action: 'document',
        estimatedTime: '5 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-3',
        name: 'Notify Stakeholders',
        description: 'Notify relevant stakeholders',
        action: 'notify',
        estimatedTime: '2 min',
        requiresApproval: false,
        autoAdvance: false,
      },
    ],
    cancel: [
      {
        id: 'step-1',
        name: 'Confirm Cancellation',
        description: 'Confirm cancellation request',
        action: 'confirm',
        estimatedTime: '1 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-2',
        name: 'Release Resources',
        description: 'Release allocated resources',
        action: 'release',
        estimatedTime: '3 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-3',
        name: 'Notify Stakeholders',
        description: 'Notify stakeholders of cancellation',
        action: 'notify',
        estimatedTime: '2 min',
        requiresApproval: false,
        autoAdvance: false,
      },
    ],
    retry: [
      {
        id: 'step-1',
        name: 'Investigate Failure',
        description: 'Investigate why previous attempt failed',
        action: 'investigate',
        estimatedTime: '10 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-2',
        name: 'Fix Issue',
        description: 'Fix the identified issue',
        action: 'fix',
        estimatedTime: '15 min',
        requiresApproval: false,
        autoAdvance: true,
      },
      {
        id: 'step-3',
        name: 'Retry Execution',
        description: 'Retry the workflow execution',
        action: 'retry',
        estimatedTime: '5 min',
        requiresApproval: false,
        autoAdvance: false,
      },
    ],
    custom: [],
  },
  // Add other entity types as needed
  invoice: {
    create: [],
    approve: [],
    process: [],
    assign: [],
    complete: [],
    escalate: [],
    cancel: [],
    retry: [],
    custom: [],
  },
  payment: {
    create: [],
    approve: [],
    process: [],
    assign: [],
    complete: [],
    escalate: [],
    cancel: [],
    retry: [],
    custom: [],
  },
  quote: {
    create: [],
    approve: [],
    process: [],
    assign: [],
    complete: [],
    escalate: [],
    cancel: [],
    retry: [],
    custom: [],
  },
  lead: {
    create: [],
    approve: [],
    process: [],
    assign: [],
    complete: [],
    escalate: [],
    cancel: [],
    retry: [],
    custom: [],
  },
  customer: {
    create: [],
    approve: [],
    process: [],
    assign: [],
    complete: [],
    escalate: [],
    cancel: [],
    retry: [],
    custom: [],
  },
  employee: {
    create: [],
    approve: [],
    process: [],
    assign: [],
    complete: [],
    escalate: [],
    cancel: [],
    retry: [],
    custom: [],
  },
  product: {
    create: [],
    approve: [],
    process: [],
    assign: [],
    complete: [],
    escalate: [],
    cancel: [],
    retry: [],
    custom: [],
  },
  vendor: {
    create: [],
    approve: [],
    process: [],
    assign: [],
    complete: [],
    escalate: [],
    cancel: [],
    retry: [],
    custom: [],
  },
  ticket: {
    create: [],
    approve: [],
    process: [],
    assign: [],
    complete: [],
    escalate: [],
    cancel: [],
    retry: [],
    custom: [],
  },
  contract: {
    create: [],
    approve: [],
    process: [],
    assign: [],
    complete: [],
    escalate: [],
    cancel: [],
    retry: [],
    custom: [],
  },
  shipment: {
    create: [],
    approve: [],
    process: [],
    assign: [],
    complete: [],
    escalate: [],
    cancel: [],
    retry: [],
    custom: [],
  },
};

// Start workflow execution
export function startWorkflowExecution(
  entityType: EntityType,
  entityId: string,
  workflowType: WorkflowType,
  context?: Record<string, any>
): WorkflowExecution {
  const steps = workflowDefinitions[entityType]?.[workflowType] || [];
  
  return {
    workflowId: `workflow-${Date.now()}-${workflowType}`,
    workflowType,
    entityType,
    entityId,
    currentStep: 0,
    steps,
    status: 'pending',
    startedAt: new Date().toISOString(),
    context: context || {},
  };
}

// Execute current step
export function executeStep(execution: WorkflowExecution): ExecutionResult {
  if (execution.status === 'completed' || execution.status === 'failed' || execution.status === 'cancelled') {
    return {
      success: false,
      workflowId: execution.workflowId,
      stepCompleted: execution.currentStep,
      totalSteps: execution.steps.length,
      status: execution.status,
      sideEffects: [],
      error: 'Workflow already completed or failed',
    };
  }

  const currentStep = execution.steps[execution.currentStep];
  
  if (!currentStep) {
    return {
      success: false,
      workflowId: execution.workflowId,
      stepCompleted: execution.currentStep,
      totalSteps: execution.steps.length,
      status: execution.status,
      sideEffects: [],
      error: 'No current step',
    };
  }

  // Check if step requires approval
  if (currentStep.requiresApproval) {
    return {
      success: true,
      workflowId: execution.workflowId,
      stepCompleted: execution.currentStep,
      totalSteps: execution.steps.length,
      status: 'pending',
      nextStep: currentStep,
      sideEffects: ['Approval required'],
    };
  }

  // Execute the step (in a real app, this would actually execute the action)
  const sideEffects = currentStep.sideEffects || [];
  sideEffects.push(`Executed action: ${currentStep.action}`);

  // Auto-advance if enabled
  if (currentStep.autoAdvance) {
    execution.currentStep++;
  }

  // Check if workflow is complete
  if (execution.currentStep >= execution.steps.length) {
    execution.status = 'completed';
    execution.completedAt = new Date().toISOString();
  }

  return {
    success: true,
    workflowId: execution.workflowId,
    stepCompleted: execution.currentStep,
    totalSteps: execution.steps.length,
    status: execution.status,
    nextStep: execution.steps[execution.currentStep],
    sideEffects,
  };
}

// Complete workflow execution
export function completeWorkflow(execution: WorkflowExecution): ExecutionResult {
  execution.status = 'completed';
  execution.completedAt = new Date().toISOString();
  
  return {
    success: true,
    workflowId: execution.workflowId,
    stepCompleted: execution.steps.length,
    totalSteps: execution.steps.length,
    status: 'completed',
    sideEffects: ['Workflow completed'],
  };
}

// Cancel workflow execution
export function cancelWorkflow(execution: WorkflowExecution, reason?: string): ExecutionResult {
  execution.status = 'cancelled';
  execution.completedAt = new Date().toISOString();
  execution.error = reason;
  
  return {
    success: true,
    workflowId: execution.workflowId,
    stepCompleted: execution.currentStep,
    totalSteps: execution.steps.length,
    status: 'cancelled',
    sideEffects: ['Workflow cancelled'],
    error: reason,
  };
}

// Fail workflow execution
export function failWorkflow(execution: WorkflowExecution, error: string): ExecutionResult {
  execution.status = 'failed';
  execution.completedAt = new Date().toISOString();
  execution.error = error;
  
  return {
    success: false,
    workflowId: execution.workflowId,
    stepCompleted: execution.currentStep,
    totalSteps: execution.steps.length,
    status: 'failed',
    sideEffects: [],
    error,
  };
}

// Get workflow progress
export function getWorkflowProgress(execution: WorkflowExecution): {
  currentStep: number;
  totalSteps: number;
  percentage: number;
  currentStepName: string;
  remainingSteps: number;
} {
  const currentStep = execution.currentStep;
  const totalSteps = execution.steps.length;
  const percentage = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;
  const currentStepName = execution.steps[currentStep]?.name || 'Completed';
  const remainingSteps = totalSteps - currentStep;

  return {
    currentStep,
    totalSteps,
    percentage,
    currentStepName,
    remainingSteps,
  };
}

// Get available workflows for entity type
export function getAvailableWorkflows(entityType: EntityType): WorkflowType[] {
  const workflows = workflowDefinitions[entityType];
  return Object.entries(workflows)
    .filter(([_, steps]) => steps.length > 0)
    .map(([type, _]) => type as WorkflowType);
}

// Get workflow steps
export function getWorkflowSteps(entityType: EntityType, workflowType: WorkflowType): WorkflowStep[] {
  return workflowDefinitions[entityType]?.[workflowType] || [];
}

// Get workflow summary
export function getWorkflowSummary(workflowType: WorkflowType, steps: WorkflowStep[]): {
  totalSteps: number;
  estimatedTime: string;
  requiresApproval: boolean;
  autoAdvanceSteps: number;
} {
  const totalSteps = steps.length;
  const requiresApproval = steps.some(step => step.requiresApproval);
  const autoAdvanceSteps = steps.filter(step => step.autoAdvance).length;
  
  // Calculate total estimated time
  const totalMinutes = steps.reduce((sum, step) => {
    const match = step.estimatedTime.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);
  
  const estimatedTime = totalMinutes < 60 
    ? `${totalMinutes} min` 
    : `${Math.round(totalMinutes / 60)} hours`;

  return {
    totalSteps,
    estimatedTime,
    requiresApproval,
    autoAdvanceSteps,
  };
}

// Batch execute workflows
export function batchExecuteWorkflows(executions: WorkflowExecution[]): ExecutionResult[] {
  return executions.map(execution => executeStep(execution));
}

// Get workflows requiring approval
export function getWorkflowsRequiringApproval(entityType: EntityType): WorkflowType[] {
  const workflows = workflowDefinitions[entityType];
  return Object.entries(workflows)
    .filter(([_, steps]) => steps.some(step => step.requiresApproval))
    .map(([type, _]) => type as WorkflowType);
}

// Get workflow by ID
export function getWorkflowById(workflowId: string, executions: WorkflowExecution[]): WorkflowExecution | null {
  return executions.find(e => e.workflowId === workflowId) || null;
}

// Get active workflows
export function getActiveWorkflows(executions: WorkflowExecution[]): WorkflowExecution[] {
  return executions.filter(e => e.status === 'pending' || e.status === 'in_progress');
}

// Get completed workflows
export function getCompletedWorkflows(executions: WorkflowExecution[]): WorkflowExecution[] {
  return executions.filter(e => e.status === 'completed');
}

// Get failed workflows
export function getFailedWorkflows(executions: WorkflowExecution[]): WorkflowExecution[] {
  return executions.filter(e => e.status === 'failed');
}

// Retry failed workflow
export function retryWorkflow(execution: WorkflowExecution): WorkflowExecution {
  execution.status = 'pending';
  execution.currentStep = 0;
  execution.error = undefined;
  execution.startedAt = new Date().toISOString();
  execution.completedAt = undefined;
  
  return execution;
}

// Skip current step
export function skipStep(execution: WorkflowExecution): ExecutionResult {
  if (execution.currentStep < execution.steps.length) {
    execution.currentStep++;
  }
  
  if (execution.currentStep >= execution.steps.length) {
    execution.status = 'completed';
    execution.completedAt = new Date().toISOString();
  }
  
  return {
    success: true,
    workflowId: execution.workflowId,
    stepCompleted: execution.currentStep,
    totalSteps: execution.steps.length,
    status: execution.status,
    nextStep: execution.steps[execution.currentStep],
    sideEffects: ['Step skipped'],
  };
}

// Get workflow execution statistics
export function getWorkflowStatistics(executions: WorkflowExecution[]): {
  total: number;
  completed: number;
  failed: number;
  cancelled: number;
  inProgress: number;
  pending: number;
  successRate: number;
} {
  return {
    total: executions.length,
    completed: executions.filter(e => e.status === 'completed').length,
    failed: executions.filter(e => e.status === 'failed').length,
    cancelled: executions.filter(e => e.status === 'cancelled').length,
    inProgress: executions.filter(e => e.status === 'in_progress').length,
    pending: executions.filter(e => e.status === 'pending').length,
    successRate: executions.length > 0 
      ? Math.round((executions.filter(e => e.status === 'completed').length / executions.length) * 100)
      : 0,
  };
}
