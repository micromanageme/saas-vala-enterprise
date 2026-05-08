// Universal Consistency Engine - ONE unified operational language across the entire system
import type { EntityType, EntityState } from "./operational-state-machine";
import type { Priority } from "./system-priority-engine";

export type ConsistencyDomain = 
  | 'navigation'
  | 'workflows'
  | 'buttons'
  | 'tables'
  | 'forms'
  | 'approvals'
  | 'statuses'
  | 'search'
  | 'filters'
  | 'shortcuts'
  | 'terminology'
  | 'layouts'
  | 'notifications'
  | 'actions'
  | 'colors'
  | 'priorities';

export interface ConsistencyRule {
  id: string;
  domain: ConsistencyDomain;
  name: string;
  description: string;
  pattern: string;
  enforcement: 'strict' | 'recommended' | 'informational';
  examples: string[];
  violations: string[];
}

export interface ConsistencyReport {
  overallScore: number; // 0-100
  domainScores: Record<ConsistencyDomain, {
    score: number;
    violations: number;
    warnings: number;
  }>;
  criticalViolations: Array<{
    domain: ConsistencyDomain;
    rule: string;
    description: string;
    location: string;
  }>;
  recommendations: string[];
}

// Consistency rules for each domain
export const consistencyRules: Record<ConsistencyDomain, ConsistencyRule[]> = {
  navigation: [
    {
      id: 'nav-001',
      domain: 'navigation',
      name: 'Navigation Position',
      description: 'Primary navigation always on left sidebar',
      pattern: 'sidebar-left',
      enforcement: 'strict',
      examples: ['Dashboard, Orders, Customers in left sidebar'],
      violations: [],
    },
    {
      id: 'nav-002',
      domain: 'navigation',
      name: 'Breadcrumb Depth',
      description: 'Maximum 3 breadcrumb levels',
      pattern: 'breadcrumbs-max-3',
      enforcement: 'recommended',
      examples: ['Home > Orders > Order Details'],
      violations: [],
    },
    {
      id: 'nav-003',
      domain: 'navigation',
      name: 'Back Button Behavior',
      description: 'Back button always returns to previous view',
      pattern: 'back-button-consistent',
      enforcement: 'strict',
      examples: ['Browser back and UI back behave identically'],
      violations: [],
    },
  ],
  workflows: [
    {
      id: 'wf-001',
      domain: 'workflows',
      name: 'Workflow Steps',
      description: 'All workflows follow: Initiate → Review → Approve → Execute → Complete',
      pattern: 'workflow-standard-steps',
      enforcement: 'strict',
      examples: ['Order creation, Invoice approval, Payment processing'],
      violations: [],
    },
    {
      id: 'wf-002',
      domain: 'workflows',
      name: 'Approval Threshold',
      description: 'Approvals required above $10,000',
      pattern: 'approval-threshold-10000',
      enforcement: 'strict',
      examples: ['Orders > $10k require executive approval'],
      violations: [],
    },
    {
      id: 'wf-003',
      domain: 'workflows',
      name: 'Escalation Rules',
      description: 'Auto-escalate after 24 hours without action',
      pattern: 'escalation-24h',
      enforcement: 'strict',
      examples: ['Pending approvals auto-escalate'],
      violations: [],
    },
  ],
  buttons: [
    {
      id: 'btn-001',
      domain: 'buttons',
      name: 'Primary Action',
      description: 'Primary action always right-aligned, blue color',
      pattern: 'primary-right-blue',
      enforcement: 'strict',
      examples: ['Save, Submit, Approve buttons'],
      violations: [],
    },
    {
      id: 'btn-002',
      domain: 'buttons',
      name: 'Destructive Action',
      description: 'Destructive actions always red color',
      pattern: 'destructive-red',
      enforcement: 'strict',
      examples: ['Delete, Cancel, Reject buttons'],
      violations: [],
    },
    {
      id: 'btn-003',
      domain: 'buttons',
      name: 'Button Labels',
      description: 'Button labels use imperative verbs',
      pattern: 'button-imperative-verbs',
      enforcement: 'recommended',
      examples: ['Save, Submit, Approve (not: Saving, Submitted)'],
      violations: [],
    },
  ],
  tables: [
    {
      id: 'tbl-001',
      domain: 'tables',
      name: 'Table Actions',
      description: 'Row actions always in rightmost column',
      pattern: 'actions-right-column',
      enforcement: 'strict',
      examples: ['Edit, Delete, View buttons in last column'],
      violations: [],
    },
    {
      id: 'tbl-002',
      domain: 'tables',
      name: 'Sorting',
      description: 'All columns sortable by default',
      pattern: 'all-columns-sortable',
      enforcement: 'recommended',
      examples: ['Click any column header to sort'],
      violations: [],
    },
    {
      id: 'tbl-003',
      domain: 'tables',
      name: 'Pagination',
      description: 'Pagination always at bottom right',
      pattern: 'pagination-bottom-right',
      enforcement: 'strict',
      examples: ['1-50 of 234 items > >'],
      violations: [],
    },
  ],
  forms: [
    {
      id: 'frm-001',
      domain: 'forms',
      name: 'Required Fields',
      description: 'Required fields marked with asterisk (*)',
      pattern: 'required-asterisk',
      enforcement: 'strict',
      examples: ['Name * Email * Phone'],
      violations: [],
    },
    {
      id: 'frm-002',
      domain: 'forms',
      name: 'Form Layout',
      description: 'Forms use single column layout',
      pattern: 'single-column-layout',
      enforcement: 'recommended',
      examples: ['Fields stack vertically'],
      violations: [],
    },
    {
      id: 'frm-003',
      domain: 'forms',
      name: 'Save Position',
      description: 'Save button always at bottom right',
      pattern: 'save-bottom-right',
      enforcement: 'strict',
      examples: ['Save/Submit at form end'],
      violations: [],
    },
  ],
  approvals: [
    {
      id: 'apr-001',
      domain: 'approvals',
      name: 'Approval Flow',
      description: 'Approvals follow: Requester → Manager → Approver',
      pattern: 'approval-flow-standard',
      enforcement: 'strict',
      examples: ['Standard 3-step approval chain'],
      violations: [],
    },
    {
      id: 'apr-002',
      domain: 'approvals',
      name: 'Approval Notification',
      description: 'Approvers notified via email and in-app',
      pattern: 'approval-notification-dual',
      enforcement: 'strict',
      examples: ['Email + notification bell'],
      violations: [],
    },
    {
      id: 'apr-003',
      domain: 'approvals',
      name: 'Approval History',
      description: 'Approval history always visible',
      pattern: 'approval-history-visible',
      enforcement: 'strict',
      examples: ['Show who approved when'],
      violations: [],
    },
  ],
  statuses: [
    {
      id: 'sts-001',
      domain: 'statuses',
      name: 'Status Colors',
      description: 'Status colors: Green=success, Yellow=warning, Red=critical',
      pattern: 'status-colors-standard',
      enforcement: 'strict',
      examples: ['Green=active, Yellow=pending, Red=blocked'],
      violations: [],
    },
    {
      id: 'sts-002',
      domain: 'statuses',
      name: 'Status Labels',
      description: 'Status labels use consistent terminology',
      pattern: 'status-labels-consistent',
      enforcement: 'strict',
      examples: ['Use "Approved" not "OK" or "Yes"'],
      violations: [],
    },
    {
      id: 'sts-003',
      domain: 'statuses',
      name: 'Status Icons',
      description: 'Status icons match semantic meaning',
      pattern: 'status-icons-semantic',
      enforcement: 'recommended',
      examples: ['Check=success, X=critical, Clock=pending'],
      violations: [],
    },
  ],
  search: [
    {
      id: 'srch-001',
      domain: 'search',
      name: 'Search Position',
      description: 'Search always in top right header',
      pattern: 'search-top-right',
      enforcement: 'strict',
      examples: ['Search icon in header'],
      violations: [],
    },
    {
      id: 'srch-002',
      domain: 'search',
      name: 'Search Shortcut',
      description: 'Ctrl+K / Cmd+K opens search',
      pattern: 'search-shortcut-cmd-k',
      enforcement: 'strict',
      examples: ['Global search shortcut'],
      violations: [],
    },
    {
      id: 'srch-003',
      domain: 'search',
      name: 'Search Scope',
      description: 'Search scope always visible',
      pattern: 'search-scope-visible',
      enforcement: 'recommended',
      examples: ['Show "Search in: Orders"'],
      violations: [],
    },
  ],
  filters: [
    {
      id: 'flt-001',
      domain: 'filters',
      name: 'Filter Position',
      description: 'Filters always above table/list',
      pattern: 'filters-above-list',
      enforcement: 'strict',
      examples: ['Filter bar before data'],
      violations: [],
    },
    {
      id: 'flt-002',
      domain: 'filters',
      name: 'Clear Filters',
      description: 'Clear filters button always visible',
      pattern: 'clear-filters-visible',
      enforcement: 'strict',
      examples: ['"Clear all filters" button'],
      violations: [],
    },
    {
      id: 'flt-003',
      domain: 'filters',
      name: 'Active Filters',
      description: 'Active filters shown as tags',
      pattern: 'active-filters-tags',
      enforcement: 'recommended',
      examples: ['[Status: Active] [Type: Order]'],
      violations: [],
    },
  ],
  shortcuts: [
    {
      id: 'shc-001',
      domain: 'shortcuts',
      name: 'Save Shortcut',
      description: 'Ctrl+S / Cmd+S saves current form',
      pattern: 'save-shortcut-cmd-s',
      enforcement: 'strict',
      examples: ['Universal save shortcut'],
      violations: [],
    },
    {
      id: 'shc-002',
      domain: 'shortcuts',
      name: 'Escape Behavior',
      description: 'Escape closes modals/dropdowns',
      pattern: 'escape-closes-modals',
      enforcement: 'strict',
      examples: ['ESC key behavior'],
      violations: [],
    },
    {
      id: 'shc-003',
      domain: 'shortcuts',
      name: 'Shortcut Help',
      description: 'Ctrl+/ / Cmd+/ shows shortcuts',
      pattern: 'shortcut-help-cmd-slash',
      enforcement: 'recommended',
      examples: ['Shortcut cheat sheet'],
      violations: [],
    },
  ],
  terminology: [
    {
      id: 'trm-001',
      domain: 'terminology',
      name: 'Entity Names',
      description: 'Entity names always capitalized',
      pattern: 'entity-names-capitalized',
      enforcement: 'strict',
      examples: ['Order, Customer, Invoice (not order, customer)'],
      violations: [],
    },
    {
      id: 'trm-002',
      domain: 'terminology',
      name: 'Action Verbs',
      description: 'Action verbs use consistent tense',
      pattern: 'action-verbs-present',
      enforcement: 'strict',
      examples: ['Create, Edit, Delete (not Created, Edited)'],
      violations: [],
    },
    {
      id: 'trm-003',
      domain: 'terminology',
      name: 'Date Format',
      description: 'Dates always in YYYY-MM-DD format',
      pattern: 'date-format-yyyy-mm-dd',
      enforcement: 'strict',
      examples: ['2024-05-08'],
      violations: [],
    },
  ],
  layouts: [
    {
      id: 'lyt-001',
      domain: 'layouts',
      name: 'Page Structure',
      description: 'Pages follow: Header → Content → Footer',
      pattern: 'page-header-content-footer',
      enforcement: 'strict',
      examples: ['Standard page layout'],
      violations: [],
    },
    {
      id: 'lyt-002',
      domain: 'layouts',
      name: 'Card Spacing',
      description: 'Cards use 16px spacing',
      pattern: 'card-spacing-16px',
      enforcement: 'recommended',
      examples: ['Consistent gap between cards'],
      violations: [],
    },
    {
      id: 'lyt-003',
      domain: 'layouts',
      name: 'Mobile Responsiveness',
      description: 'All layouts mobile-responsive',
      pattern: 'mobile-responsive',
      enforcement: 'strict',
      examples: ['Stack on mobile, grid on desktop'],
      violations: [],
    },
  ],
  notifications: [
    {
      id: 'ntf-001',
      domain: 'notifications',
      name: 'Notification Position',
      description: 'Notifications in top right corner',
      pattern: 'notifications-top-right',
      enforcement: 'strict',
      examples: ['Toast notifications position'],
      violations: [],
    },
    {
      id: 'ntf-002',
      domain: 'notifications',
      name: 'Notification Duration',
      description: 'Success notifications auto-dismiss after 3s',
      pattern: 'success-dismiss-3s',
      enforcement: 'recommended',
      examples: ['Auto-dismiss timing'],
      violations: [],
    },
    {
      id: 'ntf-003',
      domain: 'notifications',
      name: 'Notification Types',
      description: 'Notification types: success, error, warning, info',
      pattern: 'notification-types-four',
      enforcement: 'strict',
      examples: ['Standard notification types'],
      violations: [],
    },
  ],
  actions: [
    {
      id: 'act-001',
      domain: 'actions',
      name: 'Action Position',
      description: 'Primary actions in header, secondary in dropdown',
      pattern: 'primary-header-secondary-dropdown',
      enforcement: 'strict',
      examples: ['Action button placement'],
      violations: [],
    },
    {
      id: 'act-002',
      domain: 'actions',
      name: 'Action Confirmation',
      description: 'Destructive actions require confirmation',
      pattern: 'destructive-require-confirm',
      enforcement: 'strict',
      examples: ['Confirm delete dialog'],
      violations: [],
    },
    {
      id: 'act-003',
      domain: 'actions',
      name: 'Action Feedback',
      description: 'All actions provide feedback',
      pattern: 'actions-provide-feedback',
      enforcement: 'strict',
      examples: ['Loading states, success toasts'],
      violations: [],
    },
  ],
  colors: [
    {
      id: 'clr-001',
      domain: 'colors',
      name: 'Primary Color',
      description: 'Primary color: oklch(0.65 0.18 200)',
      pattern: 'primary-color-blue',
      enforcement: 'strict',
      examples: ['Main brand color'],
      violations: [],
    },
    {
      id: 'clr-002',
      domain: 'colors',
      name: 'Success Color',
      description: 'Success color: oklch(0.68 0.18 75)',
      pattern: 'success-color-green',
      enforcement: 'strict',
      examples: ['Success states'],
      violations: [],
    },
    {
      id: 'clr-003',
      domain: 'colors',
      name: 'Error Color',
      description: 'Error color: oklch(0.6 0.2 15)',
      pattern: 'error-color-red',
      enforcement: 'strict',
      examples: ['Error states'],
      violations: [],
    },
  ],
  priorities: [
    {
      id: 'prio-001',
      domain: 'priorities',
      name: 'Priority Levels',
      description: 'Priority levels: critical, urgent, normal, low',
      pattern: 'priority-levels-four',
      enforcement: 'strict',
      examples: ['Standard priority hierarchy'],
      violations: [],
    },
    {
      id: 'prio-002',
      domain: 'priorities',
      name: 'Priority Colors',
      description: 'Priority colors: critical=red, urgent=orange, normal=blue, low=gray',
      pattern: 'priority-colors-standard',
      enforcement: 'strict',
      examples: ['Priority color coding'],
      violations: [],
    },
    {
      id: 'prio-003',
      domain: 'priorities',
      name: 'Priority Sorting',
      description: 'Items sorted by priority: critical → urgent → normal → low',
      pattern: 'priority-sort-descending',
      enforcement: 'strict',
      examples: ['Priority-based sorting'],
      violations: [],
    },
  ],
};

// Validate consistency across domains
export function validateConsistency(domain: ConsistencyDomain, context: any): {
  valid: boolean;
  violations: Array<{
    rule: string;
    description: string;
    severity: 'error' | 'warning' | 'info';
  }>;
} {
  const rules = consistencyRules[domain];
  const violations: Array<{
    rule: string;
    description: string;
    severity: 'error' | 'warning' | 'info';
  }> = [];

  rules.forEach(rule => {
    // In a real app, this would check the actual implementation
    // For now, return mock validation
    if (rule.enforcement === 'strict' && Math.random() > 0.9) {
      violations.push({
        rule: rule.id,
        description: `Rule violated: ${rule.description}`,
        severity: 'error',
      });
    }
  });

  return {
    valid: violations.length === 0,
    violations,
  };
}

// Generate consistency report
export function generateConsistencyReport(): ConsistencyReport {
  const domainScores: Record<ConsistencyDomain, {
    score: number;
    violations: number;
    warnings: number;
  }> = {} as any;

  let totalScore = 0;
  const criticalViolations: Array<{
    domain: ConsistencyDomain;
    rule: string;
    description: string;
    location: string;
  }> = [];

  Object.entries(consistencyRules).forEach(([domain, rules]) => {
    const violations = rules.filter(r => r.enforcement === 'strict' && Math.random() > 0.95).length;
    const warnings = rules.filter(r => r.enforcement === 'recommended' && Math.random() > 0.9).length;
    const score = Math.max(0, 100 - (violations * 20) - (warnings * 5));

    domainScores[domain as ConsistencyDomain] = {
      score,
      violations,
      warnings,
    };

    totalScore += score;

    if (violations > 0) {
      rules.filter(r => r.enforcement === 'strict').forEach(rule => {
        criticalViolations.push({
          domain: domain as ConsistencyDomain,
          rule: rule.id,
          description: rule.description,
          location: 'System-wide',
        });
      });
    }
  });

  const overallScore = Math.round(totalScore / Object.keys(consistencyRules).length);

  return {
    overallScore,
    domainScores,
    criticalViolations,
    recommendations: [
      'Enforce strict consistency rules across all domains',
      'Implement automated consistency checks in CI/CD',
      'Create style guide documentation for all domains',
      'Train team on consistency patterns',
      'Regular consistency audits',
    ],
  };
}

// Get consistency guidelines for a domain
export function getConsistencyGuidelines(domain: ConsistencyDomain): string[] {
  const rules = consistencyRules[domain];
  return rules.map(rule => rule.description);
}

// Check if component follows consistency rules
export function checkComponentConsistency(
  componentType: string,
  componentProps: any
): {
  consistent: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check common consistency patterns
  if (componentType === 'button') {
    if (!componentProps.variant) {
      issues.push('Button missing variant property');
    }
    if (componentProps.variant === 'destructive' && !componentProps.onConfirm) {
      issues.push('Destructive button requires confirmation');
    }
  }

  if (componentType === 'table') {
    if (!componentProps.sortable) {
      issues.push('Table should be sortable');
    }
    if (!componentProps.pagination) {
      issues.push('Table should have pagination');
    }
  }

  if (componentType === 'form') {
    if (!componentProps.onSave) {
      issues.push('Form should have save handler');
    }
    if (!componentProps.validation) {
      issues.push('Form should have validation');
    }
  }

  return {
    consistent: issues.length === 0,
    issues,
  };
}

// Get consistency score for a domain
export function getDomainConsistencyScore(domain: ConsistencyDomain): number {
  const rules = consistencyRules[domain];
  const strictRules = rules.filter(r => r.enforcement === 'strict');
  const recommendedRules = rules.filter(r => r.enforcement === 'recommended');
  
  // In a real app, this would check actual implementation
  // For now, return a high score to indicate good consistency
  return 95;
}

// Enforce consistency rule
export function enforceConsistencyRule(
  ruleId: string,
  context: any
): {
  enforced: boolean;
  message: string;
} {
  // Find the rule
  let foundRule: ConsistencyRule | null = null;
  for (const domain of Object.keys(consistencyRules)) {
    const rule = consistencyRules[domain as ConsistencyDomain].find(r => r.id === ruleId);
    if (rule) {
      foundRule = rule;
      break;
    }
  }

  if (!foundRule) {
    return {
      enforced: false,
      message: 'Rule not found',
    };
  }

  // In a real app, this would enforce the rule
  // For now, return success
  return {
    enforced: true,
    message: `Rule ${foundRule.name} enforced successfully`,
  };
}

// Get all consistency rules
export function getAllConsistencyRules(): ConsistencyRule[] {
  const allRules: ConsistencyRule[] = [];
  Object.values(consistencyRules).forEach(rules => {
    allRules.push(...rules);
  });
  return allRules;
}

// Get consistency rules by domain
export function getConsistencyRulesByDomain(domain: ConsistencyDomain): ConsistencyRule[] {
  return consistencyRules[domain];
}

// Get consistency rules by enforcement level
export function getConsistencyRulesByEnforcement(
  enforcement: 'strict' | 'recommended' | 'informational'
): ConsistencyRule[] {
  const allRules = getAllConsistencyRules();
  return allRules.filter(rule => rule.enforcement === enforcement);
}

// Generate consistency checklist
export function generateConsistencyChecklist(): Array<{
  domain: ConsistencyDomain;
  rules: string[];
  completed: boolean;
}> {
  return Object.entries(consistencyRules).map(([domain, rules]) => ({
    domain: domain as ConsistencyDomain,
    rules: rules.map(r => r.description),
    completed: Math.random() > 0.3, // Mock completion status
  }));
}
