import {
  LayoutDashboard, Users, Briefcase, ShoppingCart, Calculator, Boxes,
  Factory, Store, Repeat, KeyRound, Handshake, Building2, Sparkles,
  Building, GitBranch, ShieldCheck, BarChart3, FileText,
  Settings, Plug, ScrollText, Bell, MessageSquare, Calendar, Star,
  Clock, Bookmark, Zap, Target, Activity, TrendingUp, Search, Workflow,
  User, Folder, FileCheck, Globe, Palette, Lock, KanbanSquare, Bug,
  Headphones, BookOpen, FileSignature, Brush, FileBarChart, Map,
  Smartphone, MonitorSmartphone, Wallet, Trophy, Network, Bot,
  Layers, Truck, DollarSign, Plus,
} from "lucide-react";

// LAYER 1: APPS (Top-level applications like Odoo)
export type AppType = 'sales' | 'finance' | 'operations' | 'people' | 'platform' | 'insights' | 'admin';

export interface App {
  id: AppType;
  name: string;
  description: string;
  icon: any;
  color: string;
  order: number;
  infrastructureOnly?: boolean; // Only visible to admins
}

// LAYER 2: MODULES (Within each app)
export interface Module {
  id: string;
  appId: AppType;
  name: string;
  description: string;
  icon: any;
  order: number;
  infrastructureOnly?: boolean; // Only visible to admins
}

// LAYER 2: MODULES (Within each app)
export interface Module {
  id: string;
  appId: AppType;
  name: string;
  description: string;
  icon: any;
  order: number;
}

// LAYER 3: ACTIONS (Quick actions within modules)
export interface Action {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  icon: any;
  url: string;
  order: number;
}

// Workflow connections for visual flow
export interface WorkflowConnection {
  fromModule: string;
  toModule: string;
  description: string;
}

export const workflowConnections: WorkflowConnection[] = [
  { fromModule: 'crm', toModule: 'quotes', description: 'Lead → Quote' },
  { fromModule: 'quotes', toModule: 'orders', description: 'Quote → Order' },
  { fromModule: 'orders', toModule: 'invoices', description: 'Order → Invoice' },
  { fromModule: 'invoices', toModule: 'payments', description: 'Invoice → Payment' },
  { fromModule: 'recruitment', toModule: 'employees', description: 'Hired → Employee' },
  { fromModule: 'employees', toModule: 'payroll', description: 'Employee → Payroll' },
  { fromModule: 'orders', toModule: 'inventory', description: 'Order → Stock Update' },
];

// APPS (Layer 1)
export const apps: App[] = [
  {
    id: 'sales',
    name: 'Sales',
    description: 'CRM, quotes, orders, POS',
    icon: Users,
    color: 'oklch(0.7 0.18 200)',
    order: 1,
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Accounting, invoices, payments',
    icon: Calculator,
    color: 'oklch(0.72 0.18 155)',
    order: 2,
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Inventory, manufacturing, projects',
    icon: Factory,
    color: 'oklch(0.78 0.16 75)',
    order: 3,
  },
  {
    id: 'people',
    name: 'People',
    description: 'HR, recruitment, payroll',
    icon: User,
    color: 'oklch(0.68 0.18 45)',
    order: 4,
  },
  {
    id: 'platform',
    name: 'Platform',
    description: 'Automation, AI, integrations',
    icon: Layers,
    color: 'oklch(0.65 0.2 280)',
    order: 5,
    infrastructureOnly: true, // Only for admins
  },
  {
    id: 'insights',
    name: 'Insights',
    description: 'Analytics, reports, dashboards',
    icon: BarChart3,
    color: 'oklch(0.6 0.22 330)',
    order: 6,
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Settings, security, configuration',
    icon: Settings,
    color: 'oklch(0.5 0.15 270)',
    order: 7,
    infrastructureOnly: true, // Only for admins
  },
];

// MODULES (Layer 2) - grouped by app
export const modules: Record<AppType, Module[]> = {
  sales: [
    { id: 'crm', appId: 'sales', name: 'CRM', description: 'Leads & opportunities', icon: Users, order: 1 },
    { id: 'quotes', appId: 'sales', name: 'Quotes', description: 'Sales quotes', icon: FileText, order: 2 },
    { id: 'orders', appId: 'sales', name: 'Orders', description: 'Sales orders', icon: ShoppingCart, order: 3 },
    { id: 'pos', appId: 'sales', name: 'POS', description: 'Point of sale', icon: Store, order: 4 },
    { id: 'subscriptions', appId: 'sales', name: 'Subscriptions', description: 'Recurring billing', icon: Repeat, order: 5 },
  ],
  finance: [
    { id: 'accounting', appId: 'finance', name: 'Accounting', description: 'General ledger', icon: Calculator, order: 1 },
    { id: 'invoices', appId: 'finance', name: 'Invoices', description: 'Customer invoices', icon: FileText, order: 2 },
    { id: 'bills', appId: 'finance', name: 'Bills', description: 'Vendor bills', icon: FileText, order: 3 },
    { id: 'payments', appId: 'finance', name: 'Payments', description: 'Payment processing', icon: Wallet, order: 4 },
    { id: 'expenses', appId: 'finance', name: 'Expenses', description: 'Expense tracking', icon: Wallet, order: 5 },
  ],
  operations: [
    { id: 'inventory', appId: 'operations', name: 'Inventory', description: 'Stock management', icon: Boxes, order: 1 },
    { id: 'manufacturing', appId: 'operations', name: 'Manufacturing', description: 'Production', icon: Factory, order: 2 },
    { id: 'projects', appId: 'operations', name: 'Projects', description: 'Project management', icon: KanbanSquare, order: 3 },
    { id: 'logistics', appId: 'operations', name: 'Logistics', description: 'Shipping & delivery', icon: Truck, order: 4 },
  ],
  people: [
    { id: 'employees', appId: 'people', name: 'Employees', description: 'Employee directory', icon: User, order: 1 },
    { id: 'recruitment', appId: 'people', name: 'Recruitment', description: 'Hiring pipeline', icon: Network, order: 2 },
    { id: 'attendance', appId: 'people', name: 'Attendance', description: 'Time tracking', icon: Clock, order: 3 },
    { id: 'payroll', appId: 'people', name: 'Payroll', description: 'Salary processing', icon: DollarSign, order: 4 },
    { id: 'leave', appId: 'people', name: 'Leave', description: 'Leave management', icon: Calendar, order: 5 },
  ],
  platform: [
    { id: 'automation', appId: 'platform', name: 'Automation', description: 'Workflows', icon: Zap, order: 1, infrastructureOnly: true },
    { id: 'ai', appId: 'platform', name: 'AI Studio', description: 'AI assistants', icon: Bot, order: 2, infrastructureOnly: true },
    { id: 'api', appId: 'platform', name: 'API', description: 'API management', icon: Plug, order: 3, infrastructureOnly: true },
    { id: 'documents', appId: 'platform', name: 'Documents', description: 'File management', icon: Folder, order: 4 },
    { id: 'notifications', appId: 'platform', name: 'Notifications', description: 'System alerts', icon: Bell, order: 5 },
  ],
  insights: [
    { id: 'dashboard', appId: 'insights', name: 'Dashboard', description: 'Executive dashboard', icon: LayoutDashboard, order: 1 },
    { id: 'reports', appId: 'insights', name: 'Reports', description: 'Business reports', icon: FileBarChart, order: 2 },
    { id: 'analytics', appId: 'insights', name: 'Analytics', description: 'Data analytics', icon: BarChart3, order: 3 },
  ],
  admin: [
    { id: 'users', appId: 'admin', name: 'Users', description: 'User management', icon: User, order: 1 },
    { id: 'companies', appId: 'admin', name: 'Companies', description: 'Multi-company', icon: Building, order: 2 },
    { id: 'settings', appId: 'admin', name: 'Settings', description: 'System settings', icon: Settings, order: 3 },
    { id: 'security', appId: 'admin', name: 'Security', description: 'Security & audit', icon: ShieldCheck, order: 4 },
    { id: 'telemetry', appId: 'admin', name: 'Telemetry', description: 'System monitoring', icon: Activity, order: 5, infrastructureOnly: true },
    { id: 'runtime', appId: 'admin', name: 'Runtime', description: 'Runtime configuration', icon: Settings, order: 6, infrastructureOnly: true },
  ],
};

// COMMON ACTIONS (Layer 3)
export const commonActions: Action[] = [
  { id: 'create-lead', moduleId: 'crm', name: 'Create Lead', description: 'Add new lead', icon: Plus, url: '/crm/create', order: 1 },
  { id: 'create-quote', moduleId: 'quotes', name: 'Create Quote', description: 'New sales quote', icon: Plus, url: '/quotes/create', order: 2 },
  { id: 'create-invoice', moduleId: 'invoices', name: 'Create Invoice', description: 'Generate invoice', icon: Plus, url: '/invoices/create', order: 3 },
  { id: 'add-employee', moduleId: 'employees', name: 'Add Employee', description: 'New employee', icon: Plus, url: '/employees/create', order: 4 },
  { id: 'create-order', moduleId: 'orders', name: 'Create Order', description: 'New sales order', icon: Plus, url: '/orders/create', order: 5 },
];

// Get accessible apps based on user roles
export function getAccessibleApps(userRoles: string[]): App[] {
  const isAdmin = userRoles.some(r => ['admin', 'super_admin'].includes(r));
  return apps.filter(app => !app.infrastructureOnly || isAdmin);
}

// Get modules for app (filtered by infrastructure flag)
export function getModulesForApp(appId: AppType, userRoles: string[] = []): Module[] {
  const appModules = modules[appId] || [];
  const isAdmin = userRoles.some(r => ['admin', 'super_admin'].includes(r));
  return appModules.filter(module => !module.infrastructureOnly || isAdmin);
}

// Get app by ID
export function getApp(appId: AppType): App | undefined {
  return apps.find(app => app.id === appId);
}

// Get module by ID
export function getModule(moduleId: string): Module | undefined {
  for (const appModules of Object.values(modules)) {
    const module = appModules.find(m => m.id === moduleId);
    if (module) return module;
  }
  return undefined;
}

// Get actions for module
export function getActionsForModule(moduleId: string): Action[] {
  return commonActions.filter(action => action.moduleId === moduleId);
}
