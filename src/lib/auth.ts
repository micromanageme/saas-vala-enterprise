// Frontend-only enterprise auth + RBAC for SaaS Vala.
// Super Admin = highest authority master control.
import { useEffect, useState } from "react";

export type Role =
  | "SUPER_ADMIN"
  | "ERP_ADMIN"
  | "ADMIN"
  | "CRM"
  | "SALES"
  | "HR"
  | "ACCOUNTING"
  | "INVENTORY"
  | "MARKETPLACE_VENDOR"
  | "RESELLER"
  | "FRANCHISE"
  | "AFFILIATE"
  | "CUSTOMER"
  | "BILLING"
  | "SUBSCRIPTION"
  | "SUPPORT"
  | "ANALYTICS"
  | "AI_MANAGER"
  | "API_MANAGER"
  | "SECURITY_MANAGER";

export const ROLES: { id: Role; label: string }[] = [
  { id: "SUPER_ADMIN", label: "Super Admin" },
  { id: "ERP_ADMIN", label: "ERP Admin" },
  { id: "ADMIN", label: "Admin" },
  { id: "CRM", label: "CRM" },
  { id: "SALES", label: "Sales" },
  { id: "HR", label: "HR" },
  { id: "ACCOUNTING", label: "Accounting" },
  { id: "INVENTORY", label: "Inventory" },
  { id: "MARKETPLACE_VENDOR", label: "Marketplace Vendor" },
  { id: "RESELLER", label: "Reseller" },
  { id: "FRANCHISE", label: "Franchise" },
  { id: "AFFILIATE", label: "Affiliate" },
  { id: "CUSTOMER", label: "Customer" },
  { id: "BILLING", label: "Billing" },
  { id: "SUBSCRIPTION", label: "Subscription" },
  { id: "SUPPORT", label: "Support" },
  { id: "ANALYTICS", label: "Analytics" },
  { id: "AI_MANAGER", label: "AI Manager" },
  { id: "API_MANAGER", label: "API Manager" },
  { id: "SECURITY_MANAGER", label: "Security Manager" },
];

// Per-role allowed module groups. SUPER_ADMIN bypasses all checks.
const ROLE_GROUPS: Record<Role, string[] | "*"> = {
  SUPER_ADMIN: "*",
  ERP_ADMIN: ["Overview", "Sales", "Finance", "Operations", "People", "Insights", "System"],
  ADMIN: "*",
  CRM: ["Overview", "Sales", "Insights"],
  SALES: ["Overview", "Sales", "Insights"],
  HR: ["Overview", "People", "Insights"],
  ACCOUNTING: ["Overview", "Finance", "Insights"],
  INVENTORY: ["Overview", "Operations", "Insights"],
  MARKETPLACE_VENDOR: ["Overview", "Sales"],
  RESELLER: ["Overview", "Partners", "Sales"],
  FRANCHISE: ["Overview", "Partners", "Organization"],
  AFFILIATE: ["Overview", "Partners"],
  CUSTOMER: ["Overview"],
  BILLING: ["Overview", "Finance"],
  SUBSCRIPTION: ["Overview", "Sales", "Finance"],
  SUPPORT: ["Overview", "Platform"],
  ANALYTICS: ["Overview", "Insights"],
  AI_MANAGER: ["Overview", "Platform"],
  API_MANAGER: ["Overview", "Platform"],
  SECURITY_MANAGER: ["Overview", "Security", "System"],
};

export type Session = {
  email: string;
  name: string;
  role: Role;       // active (effective) role — may be impersonated
  baseRole: Role;   // permanent role from login
  impersonating?: Role | null;
  loggedInAt: number;
  device: string;
  ip: string;
  mfa: boolean;
};

const KEY = "vala:session";
const AUDIT_KEY = "vala:audit";

const SUPER = {
  email: "superadmin@saasvala.com",
  password: "SVX#UltraGodMode_EnterpriseFactory_2026!SecureMaster",
};

function audit(event: string, meta: Record<string, any> = {}) {
  if (typeof window === "undefined") return;
  try {
    const log = JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
    log.unshift({ event, meta, ts: new Date().toISOString() });
    localStorage.setItem(AUDIT_KEY, JSON.stringify(log.slice(0, 500)));
  } catch {}
}
export function getAuditLog(): { event: string; meta: any; ts: string }[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]"); } catch { return []; }
}

const listeners = new Set<(s: Session | null) => void>();
let current: Session | null = null;

function load(): Session | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch { return null; }
}
function persist(s: Session | null) {
  current = s;
  try {
    if (s) sessionStorage.setItem(KEY, JSON.stringify(s));
    else sessionStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l(s));
}

export function login(email: string, password: string): Session {
  if (email.trim().toLowerCase() !== SUPER.email || password !== SUPER.password) {
    audit("login.failed", { email });
    throw new Error("Invalid credentials");
  }
  const s: Session = {
    email: SUPER.email,
    name: "Super Admin",
    role: "SUPER_ADMIN",
    baseRole: "SUPER_ADMIN",
    impersonating: null,
    loggedInAt: Date.now(),
    device: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 60) : "unknown",
    ip: "127.0.0.1",
    mfa: true,
  };
  persist(s);
  audit("login.success", { email, role: s.role });
  return s;
}

export function logout() {
  audit("logout", { email: current?.email });
  persist(null);
}

export function impersonate(role: Role) {
  if (!current) return;
  if (current.baseRole !== "SUPER_ADMIN") return;
  audit("impersonate", { from: current.role, to: role });
  persist({ ...current, role, impersonating: role === "SUPER_ADMIN" ? null : role });
}

export function stopImpersonation() {
  if (!current) return;
  audit("impersonate.stop", { from: current.role });
  persist({ ...current, role: current.baseRole, impersonating: null });
}

export function getSession(): Session | null { return current ?? load(); }

export function useSession(): Session | null {
  const [s, setS] = useState<Session | null>(() => load());
  useEffect(() => {
    current = load();
    setS(current);
    const fn = (n: Session | null) => setS(n);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return s;
}

export function canSeeGroup(role: Role | undefined, group: string): boolean {
  if (!role) return false;
  const allowed = ROLE_GROUPS[role];
  if (allowed === "*") return true;
  return allowed.includes(group);
}

export function isSuperAdmin(s: Session | null = getSession()): boolean {
  return !!s && s.baseRole === "SUPER_ADMIN";
}
