import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Counter } from "@/components/Counter";
import { Crown, ShieldCheck, Activity, Users, Building, KeyRound, Bell, Plug, BarChart3, Globe, LogOut, Search, UserCog } from "lucide-react";
import { ROLES, useSession, impersonate, stopImpersonation, isSuperAdmin, getAuditLog, logout } from "@/lib/auth";
import { modules, groups } from "@/lib/modules";
import { toast } from "sonner";

export const Route = createFileRoute("/super-admin")({
  head: () => ({ meta: [{ title: "Super Admin — SaaS Vala" }, { name: "description", content: "Master operating control center" }] }),
  component: SuperAdminPage,
});

const tenants = ["SaaS Vala HQ", "Vala India", "Vala USA", "Vala Europe", "Vala MENA"];
const companies = ["Vala Cloud Inc.", "Vala Retail Ltd.", "Vala Tech Pvt.", "Vala Holdings"];

function SuperAdminPage() {
  const nav = useNavigate();
  const session = useSession();
  const [q, setQ] = useState("");
  const [audit, setAudit] = useState(getAuditLog());

  useEffect(() => {
    const t = setInterval(() => setAudit(getAuditLog()), 2000);
    return () => clearInterval(t);
  }, []);

  if (!session) return null;
  const sa = isSuperAdmin(session);

  const filteredModules = modules.filter((m) =>
    !q || m.title.toLowerCase().includes(q.toLowerCase()) || m.group.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header banner */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 gradient-card p-5 shadow-elegant">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full gradient-primary opacity-20 blur-3xl" />
          <div className="flex flex-wrap items-center gap-3 justify-between relative">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary shadow-glow">
                <Crown className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">Super Admin</h1>
                  <Badge className="gradient-primary text-primary-foreground border-0 text-[10px]">MASTER CONTROL</Badge>
                  {!sa && <Badge variant="outline" className="text-[10px] border-destructive/60 text-destructive">Read-only</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Signed in as <b>{session.email}</b> · base role <b>{session.baseRole}</b>
                  {session.impersonating && <> · impersonating <b className="text-warning">{session.impersonating}</b></>}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {session.impersonating && (
                <Button size="sm" variant="outline" onClick={() => { stopImpersonation(); toast.success("Returned to Super Admin"); }}>
                  <UserCog className="h-4 w-4 mr-1" />Stop impersonation
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => { logout(); nav({ to: "/login" }); }}>
                <LogOut className="h-4 w-4 mr-1" />Sign out
              </Button>
            </div>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Tenants", value: 24, icon: Building },
            { label: "Companies", value: 86, icon: Building },
            { label: "Users", value: 12842, icon: Users },
            { label: "API Calls / day", value: 2840000, icon: Plug },
          ].map((k) => (
            <Card key={k.label} className="gradient-card border-border/60 shadow-elegant hover-scale relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full gradient-primary opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</span>
                  <k.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-2 text-2xl font-bold text-gradient"><Counter value={k.value} /></div>
                <div className="mt-1 text-xs text-success">live</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Role engine */}
          <Card className="gradient-card border-border/60 shadow-elegant lg:col-span-1">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Global Role Switch</CardTitle></CardHeader>
            <CardContent className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  disabled={!sa}
                  onClick={() => { impersonate(r.id); toast.success(r.id === "SUPER_ADMIN" ? "Active: Super Admin" : `Impersonating ${r.label}`); }}
                  className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${session.role === r.id ? "border-primary/60 bg-primary/10" : "border-border/60 hover:border-primary/40 hover:bg-primary/5"} ${!sa && "opacity-50 cursor-not-allowed"}`}
                >
                  <div className="grid h-6 w-6 place-items-center rounded gradient-primary">
                    {r.id === "SUPER_ADMIN" ? <Crown className="h-3 w-3 text-primary-foreground" /> : <ShieldCheck className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <span className="flex-1">{r.label}</span>
                  {session.role === r.id && <Badge variant="outline" className="text-[9px] border-primary/60 text-primary">ACTIVE</Badge>}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Tenants / Companies */}
          <Card className="gradient-card border-border/60 shadow-elegant">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Building className="h-4 w-4 text-primary" />Tenants & Workspaces</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {tenants.map((t) => (
                <div key={t} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 hover:border-primary/40 transition">
                  <div className="flex items-center gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded gradient-primary"><Building className="h-3.5 w-3.5 text-primary-foreground" /></div>
                    <div>
                      <div className="text-sm font-medium">{t}</div>
                      <div className="text-[10px] text-muted-foreground">Active · synced</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Switched to ${t}`)}>Switch</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="gradient-card border-border/60 shadow-elegant">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Building className="h-4 w-4 text-primary" />Companies</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {companies.map((c) => (
                <div key={c} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 hover:border-primary/40 transition">
                  <div className="text-sm">{c}</div>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Active company: ${c}`)}>Activate</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Global module visibility */}
        <Card className="gradient-card border-border/60 shadow-elegant">
          <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4 text-primary" />Global Module Access</CardTitle>
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search modules / groups…" className="pl-9 h-8 bg-input/50" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredModules.map((m) => (
                <Link key={m.url} to={m.url} className="group glass rounded-xl p-3 transition-all hover:shadow-glow hover:border-primary/40 hover:-translate-y-0.5">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary text-primary-foreground shadow-glow shrink-0">
                      <m.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{m.title}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{m.group}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit + Quick controls */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="gradient-card border-border/60 shadow-elegant lg:col-span-2">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4 text-primary" />Live Audit Log</CardTitle></CardHeader>
            <CardContent className="max-h-72 overflow-y-auto">
              {audit.length === 0 ? (
                <div className="text-sm text-muted-foreground">No events yet.</div>
              ) : (
                <ul className="divide-y divide-border/60 text-xs">
                  {audit.slice(0, 50).map((a, i) => (
                    <li key={i} className="py-2 flex items-center gap-3">
                      <span className="text-[10px] font-mono text-muted-foreground w-44 shrink-0">{new Date(a.ts).toLocaleString()}</span>
                      <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">{a.event}</Badge>
                      <span className="truncate text-muted-foreground">{JSON.stringify(a.meta)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card className="gradient-card border-border/60 shadow-elegant">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><KeyRound className="h-4 w-4 text-primary" />Quick Master Controls</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              {[
                { l: "Licenses", to: "/licenses", icon: KeyRound },
                { l: "Marketplace", to: "/marketplace", icon: Globe },
                { l: "Resellers", to: "/resellers", icon: Users },
                { l: "Sessions", to: "/sessions", icon: Activity },
                { l: "Audit Trail", to: "/trail", icon: ShieldCheck },
                { l: "Notifications", to: "/notifications", icon: Bell },
                { l: "API Manager", to: "/api-manager", icon: Plug },
                { l: "Analytics", to: "/analytics", icon: BarChart3 },
              ].map((q) => (
                <Link key={q.to} to={q.to} className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 hover:border-primary/40 hover:bg-primary/5 transition text-sm">
                  <q.icon className="h-4 w-4 text-primary" />
                  <span className="flex-1">{q.l}</span>
                  <span className="text-[10px] text-muted-foreground">open →</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <p className="text-[10px] text-center text-muted-foreground">Super Admin endpoint · RBAC + audit + impersonation enforced · session secured</p>
      </div>
    </AppShell>
  );
}
