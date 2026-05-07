import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { QuickAccess } from "@/components/Workspace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { modules } from "@/lib/modules";
import { Counter } from "@/components/Counter";
import { TrendingUp, Activity, DollarSign, Users } from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "AI Dashboard — SaaS Vala" }] }),
  component: Dashboard,
});

const kpis = [
  { label: "Revenue (MTD)", value: 284920, prefix: "$", icon: DollarSign, delta: "+12.4%" },
  { label: "Active Users", value: 12847, icon: Users, delta: "+3.2%" },
  { label: "Open Pipeline", value: 1420000, prefix: "$", icon: TrendingUp, delta: "+8.7%" },
  { label: "System Health", value: 99, suffix: ".98%", icon: Activity, delta: "Stable" },
];

const trend = [
  { d: "Mon", revenue: 18400, orders: 120 }, { d: "Tue", revenue: 24200, orders: 148 },
  { d: "Wed", revenue: 21800, orders: 132 }, { d: "Thu", revenue: 32400, orders: 188 },
  { d: "Fri", revenue: 41200, orders: 224 }, { d: "Sat", revenue: 38800, orders: 208 },
  { d: "Sun", revenue: 28900, orders: 162 },
];
const channels = [
  { name: "Direct", value: 42 }, { name: "Marketplace", value: 28 },
  { name: "Resellers", value: 18 }, { name: "POS", value: 12 },
];
const COLORS = ["oklch(0.72 0.19 295)", "oklch(0.7 0.18 200)", "oklch(0.72 0.18 155)", "oklch(0.78 0.16 75)"];

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
            <Card key={k.label} className="gradient-card border-border/60 shadow-elegant hover-scale relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full gradient-primary opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
              <CardContent className="p-5 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</span>
                  <k.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-2 text-2xl font-bold text-gradient">
                  <Counter value={k.value} prefix={k.prefix} suffix={k.suffix} />
                </div>
                <div className="mt-1 text-xs text-success">{k.delta}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <QuickAccess />

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="gradient-card border-border/60 shadow-elegant lg:col-span-2">
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
          <Card className="gradient-card border-border/60 shadow-elegant">
            <CardHeader><CardTitle className="text-base">Channels</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channels} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {channels.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "oklch(0.21 0.025 270)", border: "1px solid oklch(0.32 0.03 270)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="gradient-card border-border/60 shadow-elegant">
          <CardHeader><CardTitle className="text-base">Orders by day</CardTitle></CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="d" stroke="oklch(0.68 0.03 270)" fontSize={11} />
                <YAxis stroke="oklch(0.68 0.03 270)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.21 0.025 270)", border: "1px solid oklch(0.32 0.03 270)", borderRadius: 8 }} />
                <Bar dataKey="orders" radius={[6, 6, 0, 0]} fill="oklch(0.7 0.18 200)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/60 shadow-elegant">
          <CardHeader><CardTitle>All Modules</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {modules.map((m) => (
                <Link key={m.url} to={m.url}
                  className="group glass rounded-xl p-4 transition-all hover:shadow-glow hover:border-primary/40 hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg gradient-primary text-primary-foreground shadow-glow shrink-0">
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
