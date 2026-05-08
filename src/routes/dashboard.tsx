import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { modules } from "@/lib/modules";
import { Counter } from "@/components/Counter";
import { TrendingUp, Activity, DollarSign, Users, AlertTriangle, CheckCircle2, Clock, ArrowRight, Zap } from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getAccessibleWorkspaces, getAttentionWorkflows, getTaskWorkflows } from "@/lib/workspaces";
import { useAuth } from "@/lib/hooks/useAuth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Home — SaaS Vala" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { roles, isSuperAdmin } = useAuth();
  const accessibleWorkspaces = isSuperAdmin ? [] : getAccessibleWorkspaces(roles);
  const attentionWorkflows = getAttentionWorkflows(roles);
  const taskWorkflows = getTaskWorkflows(roles);

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["analytics-revenue"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/analytics/revenue");
        if (response.ok) return response.json();
      } catch (error) {
        console.error("Failed to fetch revenue analytics:", error);
      }
      return null;
    },
  });

  const kpis = [
    { 
      label: "Revenue (MTD)", 
      value: revenueData?.analytics?.revenue?.total || 0, 
      prefix: "$", 
      icon: DollarSign, 
      delta: revenueData?.analytics?.revenue?.growth ? `+${revenueData.analytics.revenue.growth}%` : "+0%" 
    },
    { 
      label: "Active Users", 
      value: revenueData?.analytics?.marketplace?.totalVendors || 0, 
      icon: Users, 
      delta: "+0%" 
    },
    { 
      label: "Active Subscriptions", 
      value: revenueData?.analytics?.marketplace?.activeSubscriptions || 0, 
      icon: TrendingUp, 
      delta: "+0%" 
    },
    { 
      label: "Total Downloads", 
      value: revenueData?.analytics?.marketplace?.totalDownloads || 0, 
      icon: Activity, 
      delta: "+0%" 
    },
  ];

  const trendData = revenueData?.analytics?.revenue?.trend || [];
  const trend = trendData.length > 0 ? trendData.map((t: any) => ({
    d: new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' }),
    revenue: t.amount,
    orders: Math.floor(t.amount / 100),
  })) : [
    { d: "Mon", revenue: 0, orders: 0 }, { d: "Tue", revenue: 0, orders: 0 },
    { d: "Wed", revenue: 0, orders: 0 }, { d: "Thu", revenue: 0, orders: 0 },
    { d: "Fri", revenue: 0, orders: 0 }, { d: "Sat", revenue: 0, orders: 0 },
    { d: "Sun", revenue: 0, orders: 0 },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Good morning
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here's what needs your attention today
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/calendar" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              View Calendar
            </Link>
          </div>
        </div>

        {/* Attention Section - What needs action */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Needs Attention</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {attentionWorkflows.map((workflow) => (
              <Link key={workflow.id} to={workflow.url} className="group">
                <Card className="border-l-4 border-l-destructive hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-destructive/10">
                          <workflow.icon className="h-4 w-4 text-destructive" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{workflow.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{workflow.description}</p>
                        </div>
                      </div>
                      {workflow.count && workflow.count > 0 && (
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-bold text-destructive">{workflow.count}</span>
                          <span className="text-[10px] text-muted-foreground">items</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      <span>Take action</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick KPIs */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Overview</h2>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <Card key={k.label} className="border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</span>
                    <k.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-xl font-bold">
                    <Counter value={k.value} prefix={k.prefix} />
                  </div>
                  <div className="mt-1 text-xs text-success">{k.delta}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* My Tasks */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">My Tasks</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {taskWorkflows.map((workflow) => (
              <Link key={workflow.id} to={workflow.url} className="group">
                <Card className="border-border/60 hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <workflow.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{workflow.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">{workflow.description}</p>
                      </div>
                    </div>
                    {workflow.count && workflow.count > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {workflow.count} assigned to you
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Workspaces Quick Access */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Workspaces</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {accessibleWorkspaces.map((ws) => (
              <Link key={ws.id} to={`/${ws.id}`} className="group">
                <Card className="border-border/60 hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: ws.color }}
                      >
                        <ws.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{ws.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{ws.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Revenue Chart */}
        <section>
          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Revenue · last 7 days</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.19 295)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.72 0.19 295)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                  <XAxis dataKey="d" stroke="oklch(0.68 0.03 270)" fontSize={11} />
                  <YAxis stroke="oklch(0.68 0.03 270)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "oklch(0.21 0.025 270)", border: "1px solid oklch(0.32 0.03 270)", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.72 0.19 295)" fill="url(#g1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
