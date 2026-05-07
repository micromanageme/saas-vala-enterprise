import {
  LayoutDashboard, Users, Briefcase, ShoppingCart, Calculator, Boxes,
  Factory, Store, Repeat, KeyRound, Handshake, Building2, Sparkles,
  Building, GitBranch, WifiOff, ShieldCheck, BarChart3, FileText,
  Settings, Plug, ScrollText, Bell, MessageSquare,
} from "lucide-react";

export type ModuleItem = {
  title: string;
  url: string;
  icon: any;
  group: string;
  desc: string;
};

export const modules: ModuleItem[] = [
  { title: "AI Dashboard", url: "/dashboard", icon: LayoutDashboard, group: "Overview", desc: "Live KPIs and insights" },
  { title: "CRM", url: "/crm", icon: Users, group: "Sales", desc: "Leads, pipeline & customers" },
  { title: "Sales / ERP", url: "/erp", icon: Briefcase, group: "Sales", desc: "Quotes, orders & invoicing" },
  { title: "POS", url: "/pos", icon: ShoppingCart, group: "Sales", desc: "Point of sale terminals" },
  { title: "Marketplace", url: "/marketplace", icon: Store, group: "Sales", desc: "Multi-vendor marketplace" },
  { title: "Subscriptions", url: "/subscriptions", icon: Repeat, group: "Sales", desc: "Recurring billing" },
  { title: "Accounting", url: "/accounting", icon: Calculator, group: "Finance", desc: "Ledger, taxes & reports" },
  { title: "Inventory", url: "/inventory", icon: Boxes, group: "Operations", desc: "Stock, warehouses & moves" },
  { title: "Manufacturing", url: "/manufacturing", icon: Factory, group: "Operations", desc: "BoM, MO & work centers" },
  { title: "HRM", url: "/hrm", icon: Briefcase, group: "People", desc: "Employees, payroll & leave" },
  { title: "License System", url: "/licenses", icon: KeyRound, group: "Partners", desc: "Issue & manage licenses" },
  { title: "Reseller System", url: "/resellers", icon: Handshake, group: "Partners", desc: "Channel & commissions" },
  { title: "Franchise System", url: "/franchises", icon: Building2, group: "Partners", desc: "Franchisee network" },
  { title: "Multi Company", url: "/companies", icon: Building, group: "Organization", desc: "Companies & ledgers" },
  { title: "Multi Branch", url: "/branches", icon: GitBranch, group: "Organization", desc: "Branches & regions" },
  { title: "Offline Sync", url: "/offline", icon: WifiOff, group: "Platform", desc: "Offline-first queue" },
  { title: "Audit Logs", url: "/audit", icon: ShieldCheck, group: "Platform", desc: "Security & traceability" },
  { title: "Analytics", url: "/analytics", icon: BarChart3, group: "Insights", desc: "Live cross-module charts" },
  { title: "Reports", url: "/reports", icon: FileText, group: "Insights", desc: "Enterprise reports" },
  { title: "Notifications", url: "/notifications", icon: Bell, group: "Platform", desc: "System & alerts" },
  { title: "Messaging", url: "/messaging", icon: MessageSquare, group: "Platform", desc: "WhatsApp, SMS, Email" },
  { title: "API Manager", url: "/api-manager", icon: Plug, group: "Platform", desc: "Keys, webhooks & docs" },
  { title: "AI Studio", url: "/ai-studio", icon: Sparkles, group: "Platform", desc: "AI assistants & flows" },
  { title: "Audit Trail", url: "/trail", icon: ScrollText, group: "Platform", desc: "Change history" },
  { title: "Settings", url: "/settings", icon: Settings, group: "System", desc: "Full configuration" },
];

export const groups = Array.from(new Set(modules.map(m => m.group)));
