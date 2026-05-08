import {
  LayoutDashboard, Users, Briefcase, ShoppingCart, Calculator, Boxes,
  Factory, Store, Repeat, KeyRound, Handshake, Building2, Sparkles,
  Building, GitBranch, WifiOff, ShieldCheck, BarChart3, FileText,
  Settings, Plug, ScrollText, Bell, MessageSquare, Calendar, Star,
  Clock, Bookmark, Zap, Target, Activity, TrendingUp, Search, Workflow,
  User, Folder, FileCheck, Globe, Palette, Lock, KanbanSquare, Bug,
  Headphones, BookOpen, FileSignature, Brush, FileBarChart, Map,
  Smartphone, MonitorSmartphone, Wallet, Trophy, Network, Bot,
  Play, AlertTriangle, CheckCircle2, ArrowRight, Home, Layers, Grid3x3,
} from "lucide-react";

export type WorkspaceType = 
  | "home"
  | "sales"
  | "finance"
  | "operations"
  | "people"
  | "platform"
  | "insights"
  | "admin";

export type WorkflowCategory =
  | "attention"
  | "tasks"
  | "approvals"
  | "monitoring"
  | "execution";

export interface WorkflowItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  url: string;
  category: WorkflowCategory;
  priority?: "high" | "medium" | "low";
  count?: number;
}

export interface Workspace {
  id: WorkspaceType;
  name: string;
  description: string;
  icon: any;
  color: string;
  workflows: WorkflowItem[];
  modules: string[]; // Module URLs for backward compatibility
  roles: string[]; // Roles that can access this workspace
}

// Operational Workspaces (Odoo-style app hierarchy)
export const workspaces: Workspace[] = [
  {
    id: "home",
    name: "Home",
    description: "Your command center",
    icon: Home,
    color: "oklch(0.72 0.19 295)",
    roles: ["*"],
    workflows: [
      {
        id: "attention",
        title: "Needs Attention",
        description: "Items requiring your action",
        icon: AlertTriangle,
        url: "/attention",
        category: "attention",
        priority: "high",
        count: 12,
      },
      {
        id: "tasks",
        title: "My Tasks",
        description: "Assigned to you",
        icon: CheckCircle2,
        url: "/tasks",
        category: "tasks",
        count: 8,
      },
      {
        id: "approvals",
        title: "Pending Approvals",
        description: "Awaiting your decision",
        icon: FileCheck,
        url: "/approvals",
        category: "approvals",
        count: 3,
      },
      {
        id: "recent",
        title: "Recent Activity",
        description: "What's happening",
        icon: Activity,
        url: "/activity",
        category: "monitoring",
      },
    ],
    modules: ["/dashboard", "/calendar", "/activity"],
  },
  {
    id: "sales",
    name: "Sales",
    description: "Revenue & customers",
    icon: Briefcase,
    color: "oklch(0.7 0.18 200)",
    roles: ["sales", "admin", "super_admin"],
    workflows: [
      {
        id: "leads",
        title: "Leads Pipeline",
        description: "Manage opportunities",
        icon: Users,
        url: "/crm",
        category: "execution",
      },
      {
        id: "quotes",
        title: "Quotes & Orders",
        description: "Create and track",
        icon: FileText,
        url: "/erp",
        category: "execution",
      },
      {
        id: "pos",
        title: "Point of Sale",
        description: "In-person transactions",
        icon: ShoppingCart,
        url: "/pos",
        category: "execution",
      },
      {
        id: "marketplace",
        title: "Marketplace",
        description: "Multi-vendor store",
        icon: Store,
        url: "/marketplace",
        category: "execution",
      },
      {
        id: "subscriptions",
        title: "Subscriptions",
        description: "Recurring billing",
        icon: Repeat,
        url: "/subscriptions",
        category: "monitoring",
      },
    ],
    modules: ["/crm", "/erp", "/pos", "/marketplace", "/subscriptions"],
  },
  {
    id: "finance",
    name: "Finance",
    description: "Money & accounting",
    icon: Calculator,
    color: "oklch(0.72 0.18 155)",
    roles: ["finance", "accountant", "admin", "super_admin"],
    workflows: [
      {
        id: "accounting",
        title: "Accounting",
        description: "Ledger & journals",
        icon: Calculator,
        url: "/accounting",
        category: "execution",
      },
      {
        id: "invoices",
        title: "Invoices",
        description: "Bill customers",
        icon: FileText,
        url: "/invoices",
        category: "execution",
      },
      {
        id: "expenses",
        title: "Expenses",
        description: "Track spending",
        icon: Wallet,
        url: "/wallet",
        category: "execution",
      },
      {
        id: "reports",
        title: "Financial Reports",
        description: "P&L, Balance Sheet",
        icon: FileBarChart,
        url: "/reports",
        category: "monitoring",
      },
    ],
    modules: ["/accounting", "/invoices", "/wallet", "/reports"],
  },
  {
    id: "operations",
    name: "Operations",
    description: "Run the business",
    icon: Factory,
    color: "oklch(0.78 0.16 75)",
    roles: ["operations", "warehouse", "admin", "super_admin"],
    workflows: [
      {
        id: "inventory",
        title: "Inventory",
        description: "Stock management",
        icon: Boxes,
        url: "/inventory",
        category: "execution",
      },
      {
        id: "manufacturing",
        title: "Manufacturing",
        description: "Production & BoM",
        icon: Factory,
        url: "/manufacturing",
        category: "execution",
      },
      {
        id: "projects",
        title: "Projects",
        description: "Tasks & milestones",
        icon: KanbanSquare,
        url: "/projects",
        category: "execution",
      },
      {
        id: "logistics",
        title: "Logistics",
        description: "Shipping & delivery",
        icon: Truck,
        url: "/logistics",
        category: "execution",
      },
    ],
    modules: ["/inventory", "/manufacturing", "/projects", "/logistics"],
  },
  {
    id: "people",
    name: "People",
    description: "Team & HR",
    icon: Users,
    color: "oklch(0.68 0.18 45)",
    roles: ["hr", "admin", "super_admin"],
    workflows: [
      {
        id: "employees",
        title: "Employees",
        description: "Directory & profiles",
        icon: User,
        url: "/hrm",
        category: "execution",
      },
      {
        id: "recruitment",
        title: "Recruitment",
        description: "Hiring pipeline",
        icon: Network,
        url: "/recruitment",
        category: "execution",
      },
      {
        id: "payroll",
        title: "Payroll",
        description: "Salaries & taxes",
        icon: DollarSign,
        url: "/accounting",
        category: "execution",
      },
      {
        id: "attendance",
        title: "Attendance",
        description: "Time tracking",
        icon: Clock,
        url: "/activity",
        category: "monitoring",
      },
    ],
    modules: ["/hrm", "/recruitment", "/accounting", "/activity"],
  },
  {
    id: "platform",
    name: "Platform",
    description: "System & automation",
    icon: Layers,
    color: "oklch(0.65 0.2 280)",
    roles: ["platform", "admin", "super_admin"],
    workflows: [
      {
        id: "automation",
        title: "Automation",
        description: "Workflows & triggers",
        icon: Zap,
        url: "/automation",
        category: "execution",
      },
      {
        id: "ai",
        title: "AI Studio",
        description: "AI flows & bots",
        icon: Bot,
        url: "/ai-studio",
        category: "execution",
      },
      {
        id: "api",
        title: "API Manager",
        description: "Keys & webhooks",
        icon: Plug,
        url: "/api-manager",
        category: "execution",
      },
      {
        id: "documents",
        title: "Documents",
        description: "Files & e-sign",
        icon: Folder,
        url: "/documents",
        category: "execution",
      },
      {
        id: "notifications",
        title: "Notifications",
        description: "System alerts",
        icon: Bell,
        url: "/notifications",
        category: "monitoring",
      },
      {
        id: "support",
        title: "Support",
        description: "Tickets & chat",
        icon: Headphones,
        url: "/support",
        category: "execution",
      },
    ],
    modules: ["/automation", "/ai-studio", "/api-manager", "/documents", "/notifications", "/support"],
  },
  {
    id: "insights",
    name: "Insights",
    description: "Analytics & reports",
    icon: BarChart3,
    color: "oklch(0.6 0.22 330)",
    roles: ["analytics", "admin", "super_admin"],
    workflows: [
      {
        id: "dashboard",
        title: "Analytics Dashboard",
        description: "Live KPIs",
        icon: LayoutDashboard,
        url: "/dashboard",
        category: "monitoring",
      },
      {
        id: "reports",
        title: "BI Reports",
        description: "Enterprise reports",
        icon: FileBarChart,
        url: "/reports",
        category: "monitoring",
      },
      {
        id: "live",
        title: "Live Analytics",
        description: "Real-time metrics",
        icon: Activity,
        url: "/live",
        category: "monitoring",
      },
      {
        id: "heatmaps",
        title: "Heatmaps",
        description: "Density views",
        icon: Map,
        url: "/heatmaps",
        category: "monitoring",
      },
    ],
    modules: ["/dashboard", "/reports", "/live", "/heatmaps"],
  },
  {
    id: "admin",
    name: "Admin",
    description: "Configuration & security",
    icon: Settings,
    color: "oklch(0.5 0.15 270)",
    roles: ["admin", "super_admin"],
    workflows: [
      {
        id: "users",
        title: "Users",
        description: "User management",
        icon: User,
        url: "/roles",
        category: "execution",
      },
      {
        id: "companies",
        title: "Companies",
        description: "Multi-company",
        icon: Building,
        url: "/companies",
        category: "execution",
      },
      {
        id: "branches",
        title: "Branches",
        description: "Locations",
        icon: GitBranch,
        url: "/branches",
        category: "execution",
      },
      {
        id: "security",
        title: "Security",
        description: "Audit & access",
        icon: ShieldCheck,
        url: "/audit",
        category: "monitoring",
      },
      {
        id: "settings",
        title: "Settings",
        description: "System config",
        icon: Settings,
        url: "/settings",
        category: "execution",
      },
    ],
    modules: ["/roles", "/companies", "/branches", "/audit", "/settings"],
  },
];

// Get accessible workspaces based on user roles
export function getAccessibleWorkspaces(userRoles: string[]): Workspace[] {
  return workspaces.filter(ws => 
    ws.roles.includes("*") || ws.roles.some(r => userRoles.includes(r))
  );
}

// Get workspace by ID
export function getWorkspace(id: WorkspaceType): Workspace | undefined {
  return workspaces.find(ws => ws.id === id);
}

// Get workflow by ID across all workspaces
export function getWorkflow(workflowId: string): WorkflowItem | undefined {
  for (const ws of workspaces) {
    const workflow = ws.workflows.find(w => w.id === workflowId);
    if (workflow) return workflow;
  }
  return undefined;
}

// Get all workflows for attention dashboard
export function getAttentionWorkflows(userRoles: string[]): WorkflowItem[] {
  const accessible = getAccessibleWorkspaces(userRoles);
  return accessible.flatMap(ws => 
    ws.workflows.filter(w => w.category === "attention" || w.category === "approvals")
  );
}

// Get all tasks for task dashboard
export function getTaskWorkflows(userRoles: string[]): WorkflowItem[] {
  const accessible = getAccessibleWorkspaces(userRoles);
  return accessible.flatMap(ws => 
    ws.workflows.filter(w => w.category === "tasks")
  );
}
