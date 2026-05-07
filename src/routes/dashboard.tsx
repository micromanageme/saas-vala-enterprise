import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { modules } from "@/lib/modules";
import { Link } from "@tanstack/react-router";
import { TrendingUp, Activity, DollarSign, Users } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "AI Dashboard — SaaS Vala" }] }),
  component: Dashboard,
});

const kpis = [
  { label: "Revenue (MTD)", value: "$284,920", icon: DollarSign, delta: "+12.4%" },
  { label: "Active Users", value: "12,847", icon: Users, delta: "+3.2%" },
  { label: "Open Pipeline", value: "$1.42M", icon: TrendingUp, delta: "+8.7%" },
  { label: "System Health", value: "99.98%", icon: Activity, delta: "Stable" },
];

function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to <span className="text-gradient">SaaS Vala</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Unified enterprise control center · live across every module
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <Card key={k.label} className="gradient-card border-border/60 shadow-elegant hover-scale relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full gradient-primary opacity-20 blur-2xl" />
              <CardContent className="p-5 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</span>
                  <k.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-2 text-2xl font-bold text-gradient">{k.value}</div>
                <div className="mt-1 text-xs text-success">{k.delta}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="gradient-card border-border/60 shadow-elegant">
          <CardHeader><CardTitle>All Modules</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {modules.map((m) => (
                <Link key={m.url} to={m.url}
                  className="group glass rounded-xl p-4 transition-all hover:shadow-glow hover:border-primary/40 hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg gradient-primary text-primary-foreground shadow-glow">
                      <m.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{m.title}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{m.desc}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
