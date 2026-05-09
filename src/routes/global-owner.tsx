import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import {
  Globe2, TrendingUp, DollarSign, Building2, Users, ChevronDown,
  Search, Filter, Star, Settings2, Plus, ArrowUpRight, Activity,
  Briefcase, Shield, BarChart3, Boxes, LineChart, Sparkles,
  Crown, LayoutGrid, ListFilter, Bell, Pin,
} from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/global-owner")({
  head: () => ({
    meta: [
      { title: "Global Owner — SaaS Vala" },
      { name: "description", content: "Global business ownership and oversight" },
    ],
  }),
  component: Page,
});

// Curated role → dashboard route map (UI only)
const ROLE_DASHBOARDS: { group: string; items: { label: string; to: string; color: string }[] }[] = [
  {
    group: "Executive",
    items: [
      { label: "Chairman", to: "/chairman", color: "bg-violet-500" },
      { label: "CEO", to: "/ceo", color: "bg-indigo-500" },
      { label: "CFO", to: "/cfo", color: "bg-emerald-500" },
      { label: "COO", to: "/coo", color: "bg-sky-500" },
      { label: "CTO", to: "/cto", color: "bg-blue-500" },
      { label: "CMO", to: "/cmo", color: "bg-pink-500" },
      { label: "CHRO", to: "/chro", color: "bg-amber-500" },
      { label: "CIO", to: "/cio", color: "bg-cyan-500" },
      { label: "CISO", to: "/ciso", color: "bg-rose-500" },
      { label: "Board Member", to: "/board-member", color: "bg-purple-500" },
    ],
  },
  {
    group: "Administration",
    items: [
      { label: "Master Admin", to: "/master-admin", color: "bg-violet-600" },
      { label: "Root Admin", to: "/root-admin", color: "bg-red-600" },
      { label: "Universal Access Admin", to: "/root", color: "bg-rose-600" },
      { label: "Platform Superuser", to: "/platform-superuser", color: "bg-fuchsia-600" },
      { label: "Super Admin", to: "/super-admin", color: "bg-amber-600" },
      { label: "ERP Admin", to: "/erp", color: "bg-orange-500" },
      { label: "Admin Tenants", to: "/admin-tenants", color: "bg-teal-500" },
      { label: "Admin Users", to: "/admin-users", color: "bg-blue-600" },
      { label: "Admin Branches", to: "/admin-branches", color: "bg-emerald-600" },
      { label: "Admin Billing", to: "/admin-billing", color: "bg-lime-600" },
      { label: "Admin DevOps", to: "/admin-devops", color: "bg-slate-500" },
      { label: "Admin AI", to: "/admin-ai", color: "bg-indigo-600" },
    ],
  },
  {
    group: "Sales & CRM",
    items: [
      { label: "CRM", to: "/crm", color: "bg-pink-500" },
      { label: "CRM Manager", to: "/crm-manager", color: "bg-pink-600" },
      { label: "Sales", to: "/sales-manager", color: "bg-rose-500" },
      { label: "Marketing Manager", to: "/marketing-manager", color: "bg-fuchsia-500" },
      { label: "Account Manager", to: "/account-manager", color: "bg-purple-500" },
      { label: "Customer Success", to: "/customer-success", color: "bg-emerald-500" },
    ],
  },
  {
    group: "Finance",
    items: [
      { label: "Accounting", to: "/accounting", color: "bg-emerald-500" },
      { label: "Finance Manager", to: "/finance-manager", color: "bg-green-600" },
      { label: "Billing Manager", to: "/billing-manager", color: "bg-lime-500" },
      { label: "Investment Manager", to: "/investment-manager", color: "bg-teal-600" },
    ],
  },
  {
    group: "People",
    items: [
      { label: "HR Manager", to: "/hr-manager", color: "bg-amber-500" },
      { label: "HRM", to: "/hrm", color: "bg-orange-500" },
      { label: "Payroll Manager", to: "/payroll-manager", color: "bg-yellow-600" },
      { label: "Attendance Manager", to: "/attendance-manager", color: "bg-amber-600" },
      { label: "Employee", to: "/employee", color: "bg-stone-500" },
    ],
  },
  {
    group: "Operations",
    items: [
      { label: "Operations Manager", to: "/operations-manager", color: "bg-sky-500" },
      { label: "Manufacturing", to: "/manufacturing", color: "bg-zinc-600" },
      { label: "Inventory", to: "/inventory", color: "bg-cyan-600" },
      { label: "Logistics Manager", to: "/logistics-manager", color: "bg-blue-600" },
      { label: "Fleet Manager", to: "/fleet-manager", color: "bg-indigo-500" },
    ],
  },
  {
    group: "Partners",
    items: [
      { label: "Marketplace", to: "/marketplace", color: "bg-violet-500" },
      { label: "Marketplace Manager", to: "/marketplace-manager", color: "bg-violet-600" },
      { label: "Reseller", to: "/reseller-manager", color: "bg-purple-600" },
      { label: "Franchise", to: "/franchise", color: "bg-pink-600" },
      { label: "Affiliate Manager", to: "/affiliate-manager", color: "bg-fuchsia-500" },
      { label: "Merchant", to: "/merchant", color: "bg-rose-600" },
    ],
  },
  {
    group: "Platform & AI",
    items: [
      { label: "AI Studio", to: "/ai-studio", color: "bg-indigo-500" },
      { label: "AI Manager", to: "/ai-manager", color: "bg-blue-500" },
      { label: "API Manager", to: "/api-manager", color: "bg-cyan-500" },
      { label: "Automation", to: "/automation", color: "bg-teal-500" },
      { label: "Analytics", to: "/analytics", color: "bg-emerald-500" },
      { label: "BI Manager", to: "/bi-manager", color: "bg-lime-600" },
    ],
  },
  {
    group: "Security & Compliance",
    items: [
      { label: "Compliance Manager", to: "/compliance-manager", color: "bg-red-500" },
      { label: "Security Manager", to: "/governance-manager", color: "bg-rose-600" },
      { label: "Audit", to: "/audit", color: "bg-orange-600" },
      { label: "Audit Manager", to: "/audit-manager", color: "bg-amber-600" },
      { label: "Incident Manager", to: "/incident-manager", color: "bg-red-600" },
      { label: "Ethics Officer", to: "/ethics-officer", color: "bg-purple-600" },
    ],
  },
];

function Page() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const { data: ownerData, isLoading } = useQuery({
    queryKey: ["global-owner-dashboard"],
    queryFn: async () => {
      const r = await fetch("/api/executive?type=all");
      if (!r.ok) return null;
      return r.json();
    },
    refetchInterval: 30000,
  });

  const data = ownerData?.data;

  const kpis = [
    {
      label: "Global Revenue",
      value: data?.kpis?.revenue ? `$${(data.kpis.revenue / 1_000_000).toFixed(2)}M` : "$12.84M",
      delta: data?.kpis?.revenueDelta ?? 18.4,
      icon: DollarSign,
      tint: "from-emerald-500/20 to-emerald-500/0",
      ring: "ring-emerald-500/30",
    },
    {
      label: "EBITDA",
      value: data?.kpis?.ebitda ? `$${(data.kpis.ebitda / 1_000_000).toFixed(2)}M` : "$4.21M",
      delta: data?.kpis?.ebitdaDelta ?? 9.7,
      icon: TrendingUp,
      tint: "from-violet-500/20 to-violet-500/0",
      ring: "ring-violet-500/30",
    },
    {
      label: "Companies",
      value: data?.kpis?.totalCompanies?.toLocaleString() ?? "248",
      delta: 4.2,
      icon: Building2,
      tint: "from-sky-500/20 to-sky-500/0",
      ring: "ring-sky-500/30",
    },
    {
      label: "Global Regions",
      value: data?.kpis?.globalRegions ?? 36,
      delta: 2.1,
      icon: Globe2,
      tint: "from-amber-500/20 to-amber-500/0",
      ring: "ring-amber-500/30",
    },
    {
      label: "Total Users",
      value: "184,209",
      delta: 12.6,
      icon: Users,
      tint: "from-fuchsia-500/20 to-fuchsia-500/0",
      ring: "ring-fuchsia-500/30",
    },
    {
      label: "Live Activity",
      value: "12,403",
      delta: 7.8,
      icon: Activity,
      tint: "from-rose-500/20 to-rose-500/0",
      ring: "ring-rose-500/30",
    },
  ];

  const regions = data?.regions ?? [
    { region: "North America", revenue: 4_820_000, growth: 12.4, status: "Healthy" },
    { region: "Europe", revenue: 3_640_000, growth: 8.1, status: "Healthy" },
    { region: "APAC", revenue: 2_910_000, growth: 22.7, status: "Surging" },
    { region: "LATAM", revenue: 980_000, growth: 5.3, status: "Stable" },
    { region: "MEA", revenue: 490_000, growth: 14.9, status: "Growing" },
  ] : [];

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return ROLE_DASHBOARDS;
    const q = search.toLowerCase();
    return ROLE_DASHBOARDS.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.label.toLowerCase().includes(q)),
    })).filter((g) => g.items.length);
  }, [search]);

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Odoo-style Control Panel */}
        <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-xl border-b border-border/60">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="grid h-8 w-8 place-items-center rounded-md gradient-primary shadow-sm">
                <Crown className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-[15px] font-semibold tracking-tight truncate">Global Owner</h1>
                  <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">
                    Master
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  Global business ownership · oversight across all entities
                </p>
              </div>
            </div>

            <div className="flex-1" />

            {/* Role Dashboard Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-8 gap-2 gradient-primary text-primary-foreground border-0 shadow-sm">
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="text-xs">All Role Dashboards</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-80" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[560px] p-0 glass">
                <div className="p-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search role dashboards…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-7 text-xs border-0 bg-transparent focus-visible:ring-0 px-0"
                    />
                    <Badge variant="outline" className="text-[10px] h-5">
                      {filteredGroups.reduce((n, g) => n + g.items.length, 0)}
                    </Badge>
                  </div>
                </div>
                <div className="max-h-[420px] overflow-y-auto p-2">
                  {filteredGroups.map((g) => (
                    <div key={g.group} className="mb-2">
                      <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground px-2">
                        {g.group}
                      </DropdownMenuLabel>
                      <div className="grid grid-cols-2 gap-1">
                        {g.items.map((it) => (
                          <DropdownMenuItem key={it.to} asChild className="p-0">
                            <Link
                              to={it.to as any}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/60 cursor-pointer"
                            >
                              <span className={`h-2 w-2 rounded-full ${it.color}`} />
                              <span className="text-xs truncate flex-1">{it.label}</span>
                              <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                      <DropdownMenuSeparator className="my-1" />
                    </div>
                  ))}
                  {!filteredGroups.length && (
                    <div className="text-center text-xs text-muted-foreground py-6">No dashboards found.</div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden md:flex items-center gap-1 border-l border-border/60 pl-3">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Filter className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Star className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings2 className="h-3.5 w-3.5" />
              </Button>
              <div className="ml-1 inline-flex rounded-md border border-border/60 overflow-hidden">
                <button
                  onClick={() => setView("kanban")}
                  className={`px-2 h-7 text-[11px] ${view === "kanban" ? "bg-accent" : "bg-transparent"}`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`px-2 h-7 text-[11px] border-l border-border/60 ${view === "list" ? "bg-accent" : "bg-transparent"}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Breadcrumbs / Action chips */}
          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground">Home</Link>
            <span>›</span>
            <span className="text-foreground">Global Owner</span>
            <span className="ml-2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent/40 text-[10px]">
              <Pin className="h-2.5 w-2.5" /> Pinned
            </span>
            <div className="ml-auto flex items-center gap-1">
              <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px] gap-1">
                <Plus className="h-3 w-3" /> New
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px] gap-1">
                <ListFilter className="h-3 w-3" /> Filters
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Smart Buttons (Odoo style) */}
        <section>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {kpis.map((k) => (
              <Card
                key={k.label}
                className={`relative overflow-hidden border-border/60 hover:shadow-md hover:-translate-y-0.5 transition-all ring-1 ${k.ring}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${k.tint} pointer-events-none`} />
                <CardContent className="relative p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</span>
                    <k.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="mt-1.5 text-[18px] font-bold tabular-nums">{k.value}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] text-emerald-500">
                    <ArrowUpRight className="h-3 w-3" />
                    +{Number(k.delta).toFixed(1)}%
                    <span className="text-muted-foreground ml-1">vs last 30d</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Two column: Pipeline / Smart Cards */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Region Pipeline (Kanban-like) */}
          <Card className="lg:col-span-2 border-border/60">
            <div className="flex items-center justify-between p-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Regions Pipeline</h2>
                <Badge variant="outline" className="text-[10px] h-5">{regions.length}</Badge>
              </div>
              <Button size="sm" variant="ghost" className="h-7 text-[11px] gap-1">
                <Plus className="h-3 w-3" /> Region
              </Button>
            </div>
            <CardContent className="p-3">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {regions.map((r: any, idx: number) => (
                  <div
                    key={r.region}
                    className="group rounded-lg border border-border/60 bg-card hover:shadow-md hover:-translate-y-0.5 transition-all p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-6 w-6 rounded grid place-items-center text-[10px] font-bold text-white"
                          style={{
                            background: `oklch(0.65 0.18 ${(idx * 60) % 360})`,
                          }}
                        >
                          {r.region.slice(0, 2).toUpperCase()}
                        </span>
                        <h3 className="text-sm font-semibold truncate">{r.region}</h3>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[9px] h-5 border-emerald-500/40 text-emerald-500"
                      >
                        {r.status}
                      </Badge>
                    </div>
                    <div className="mt-2 text-[20px] font-bold tabular-nums">
                      ${(r.revenue / 1000).toFixed(0)}K
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-emerald-500">
                      <ArrowUpRight className="h-3 w-3" /> +{r.growth}%
                      <span className="text-muted-foreground ml-1">QoQ</span>
                    </div>
                    <div className="mt-3 h-1 rounded-full bg-accent/40 overflow-hidden">
                      <div
                        className="h-full gradient-primary"
                        style={{ width: `${Math.min(100, r.growth * 4)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Access to Role Dashboards */}
          <Card className="border-border/60">
            <div className="flex items-center justify-between p-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Quick Switch</h2>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-7 text-[11px] gap-1">
                    More <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass max-h-80 overflow-y-auto w-56">
                  {ROLE_DASHBOARDS.flatMap((g) => g.items).map((it) => (
                    <DropdownMenuItem key={it.to} asChild>
                      <Link to={it.to as any} className="text-xs">
                        <span className={`mr-2 h-2 w-2 rounded-full inline-block ${it.color}`} />
                        {it.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardContent className="p-2">
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "CEO", to: "/ceo", icon: Briefcase, color: "from-indigo-500 to-violet-500" },
                  { label: "CFO", to: "/cfo", icon: DollarSign, color: "from-emerald-500 to-teal-500" },
                  { label: "COO", to: "/coo", icon: Boxes, color: "from-sky-500 to-blue-500" },
                  { label: "CTO", to: "/cto", icon: Activity, color: "from-blue-500 to-cyan-500" },
                  { label: "Master Admin", to: "/master-admin", color: "from-violet-600 to-fuchsia-500", icon: Shield },
                  { label: "Root Admin", to: "/root-admin", color: "from-rose-600 to-red-500", icon: Crown },
                  { label: "Analytics", to: "/analytics", color: "from-emerald-500 to-lime-500", icon: LineChart },
                  { label: "Marketplace", to: "/marketplace", color: "from-fuchsia-500 to-pink-500", icon: Globe2 },
                ].map((q) => (
                  <Link
                    key={q.to}
                    to={q.to as any}
                    className="group rounded-md border border-border/60 p-2 hover:shadow-md hover:-translate-y-0.5 transition-all bg-card"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-7 w-7 rounded-md grid place-items-center bg-gradient-to-br ${q.color} text-white`}
                      >
                        <q.icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold truncate">{q.label}</div>
                        <div className="text-[9px] text-muted-foreground">Open dashboard</div>
                      </div>
                      <ArrowUpRight className="ml-auto h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Strip */}
        <Card className="border-border/60">
          <CardContent className="p-3 flex flex-wrap items-center gap-3 text-[11px]">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-500">● Healthy</Badge>
            <span className="text-muted-foreground">All regions operational</span>
            <span className="text-muted-foreground">·</span>
            <span>Sync: <span className="text-foreground">live</span></span>
            <span className="text-muted-foreground">·</span>
            <span>Last refresh: <span className="text-foreground">just now</span></span>
            <span className="ml-auto flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-muted-foreground">Real-time stream</span>
            </span>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center text-[11px] text-muted-foreground">Refreshing global metrics…</div>
        )}
      </div>
    </AppShell>
  );
}
