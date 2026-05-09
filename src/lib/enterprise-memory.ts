// @ts-nocheck
// Enterprise Memory - System remembers user context
import { type SituationalMode } from "./system-identity";

const ENTERPRISE_MEMORY_KEY = 'enterprise-memory';
const USER_SESSION_KEY = 'user-session';

export interface EnterpriseMemoryData {
  lastOperation: string;
  lastWorkflowStep: string;
  lastOperationTime: string;
  recentApprovals: Array<{
    id: string;
    type: string;
    timestamp: string;
    decision: 'approved' | 'rejected';
  }>;
  activeOperations: Array<{
    id: string;
    type: string;
    startedAt: string;
  }>;
  userPreferences: {
    defaultMode: SituationalMode;
    preferredTimeContext: 'today' | 'pending_now' | 'overdue' | 'upcoming' | 'realtime';
    collapsedSections: string[];
  };
  workflowHistory: Array<{
    operation: string;
    step: string;
    timestamp: string;
  }>;
}

export interface UserSession {
  userId: string;
  startTime: string;
  lastActivity: string;
  operationsViewed: string[];
  tasksCompleted: number;
}

// Load enterprise memory from localStorage
export function loadEnterpriseMemory(): EnterpriseMemoryData {
  try {
    const saved = localStorage.getItem(ENTERPRISE_MEMORY_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // Ignore errors
  }
  
  return {
    lastOperation: '',
    lastWorkflowStep: '',
    lastOperationTime: '',
    recentApprovals: [],
    activeOperations: [],
    userPreferences: {
      defaultMode: 'operations',
      preferredTimeContext: 'today',
      collapsedSections: [],
    },
    workflowHistory: [],
  };
}

// Save enterprise memory to localStorage
export function saveEnterpriseMemory(memory: EnterpriseMemoryData): void {
  try {
    localStorage.setItem(ENTERPRISE_MEMORY_KEY, JSON.stringify(memory));
  } catch (e) {
    // Ignore errors
  }
}

// Track last operation
export function trackLastOperation(operationId: string, workflowStep: string): void {
  const memory = loadEnterpriseMemory();
  memory.lastOperation = operationId;
  memory.lastWorkflowStep = workflowStep;
  memory.lastOperationTime = new Date().toISOString();
  
  // Add to workflow history
  memory.workflowHistory.unshift({
    operation: operationId,
    step: workflowStep,
    timestamp: new Date().toISOString(),
  });
  
  // Keep only last 20 history items
  memory.workflowHistory = memory.workflowHistory.slice(0, 20);
  
  saveEnterpriseMemory(memory);
}

// Track approval
export function trackApproval(id: string, type: string, decision: 'approved' | 'rejected'): void {
  const memory = loadEnterpriseMemory();
  memory.recentApprovals.unshift({
    id,
    type,
    timestamp: new Date().toISOString(),
    decision,
  });
  
  // Keep only last 10 approvals
  memory.recentApprovals = memory.recentApprovals.slice(0, 10);
  
  saveEnterpriseMemory(memory);
}

// Track active operation
export function startActiveOperation(id: string, type: string): void {
  const memory = loadEnterpriseMemory();
  
  // Remove if already exists
  memory.activeOperations = memory.activeOperations.filter(op => op.id !== id);
  
  memory.activeOperations.push({
    id,
    type,
    startedAt: new Date().toISOString(),
  });
  
  saveEnterpriseMemory(memory);
}

// Complete active operation
export function completeActiveOperation(id: string): void {
  const memory = loadEnterpriseMemory();
  memory.activeOperations = memory.activeOperations.filter(op => op.id !== id);
  saveEnterpriseMemory(memory);
}

// Update user preference
export function updateUserPreference<K extends keyof EnterpriseMemoryData['userPreferences']>(
  key: K,
  value: EnterpriseMemoryData['userPreferences'][K]
): void {
  const memory = loadEnterpriseMemory();
  memory.userPreferences[key] = value;
  saveEnterpriseMemory(memory);
}

// Get where user stopped
export function getUserLastPosition(): { operation: string; step: string; time: string } | null {
  const memory = loadEnterpriseMemory();
  if (!memory.lastOperation || !memory.lastWorkflowStep) {
    return null;
  }
  
  return {
    operation: memory.lastOperation,
    step: memory.lastWorkflowStep,
    time: memory.lastOperationTime,
  };
}

// Get recent activity summary
export function getRecentActivitySummary(): {
  lastApproval: string | null;
  activeOperationsCount: number;
  lastWorkflow: string | null;
} {
  const memory = loadEnterpriseMemory();
  
  return {
    lastApproval: memory.recentApprovals[0]?.timestamp || null,
    activeOperationsCount: memory.activeOperations.length,
    lastWorkflow: memory.workflowHistory[0]?.timestamp || null,
  };
}

// User session tracking
export function startUserSession(userId: string): void {
  try {
    const session: UserSession = {
      userId,
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      operationsViewed: [],
      tasksCompleted: 0,
    };
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    // Ignore errors
  }
}

export function updateSessionActivity(operationViewed?: string): void {
  try {
    const saved = localStorage.getItem(USER_SESSION_KEY);
    if (!saved) return;
    
    const session: UserSession = JSON.parse(saved);
    session.lastActivity = new Date().toISOString();
    
    if (operationViewed && !session.operationsViewed.includes(operationViewed)) {
      session.operationsViewed.push(operationViewed);
    }
    
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    // Ignore errors
  }
}

export function incrementTasksCompleted(): void {
  try {
    const saved = localStorage.getItem(USER_SESSION_KEY);
    if (!saved) return;
    
    const session: UserSession = JSON.parse(saved);
    session.tasksCompleted += 1;
    session.lastActivity = new Date().toISOString();
    
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    // Ignore errors
  }
}

export function getUserSession(): UserSession | null {
  try {
    const saved = localStorage.getItem(USER_SESSION_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // Ignore errors
  }
  return null;
}