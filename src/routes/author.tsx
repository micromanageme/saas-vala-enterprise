import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard, Package, Hammer, GitBranch, BookOpen, Store, ShoppingCart,
  Users, KeyRound, Repeat, CalendarClock, LifeBuoy, Star, BarChart3, DollarSign,
  Wallet, Megaphone, Download, Search, Sparkles, FileText, HeartPulse, Swords,
  Map as MapIcon, Trophy, Award, Globe, MessageSquare, Bell, Settings,
  Plus, Upload, CheckCircle2, Clock, AlertTriangle, TrendingUp, Eye, Edit3,
  Rocket, Crown, Flame, Languages, Mic, Paperclip, Loader2,
} from "lucide-react";
import {
  useAuthorProducts, useAuthorVersions, useAuthorOrders, useAuthorLicenses,
  useAuthorSubscriptions, useAuthorRenewals, useAuthorReviews, useAuthorPayouts,
  useAuthorRevenue, money, num, fmtDate, sum,
} from "@/lib/author-data";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function Loading() {
  return <div className="flex items-center gap-2 text-xs text-muted-foreground p-4"><Loader2 className="h-3.5 w-3.5 animate-spin" />Loading…</div>;
}
function Empty({ msg }: { msg: string }) {
  return <div className="text-xs text-muted-foreground p-4 border border-dashed border-border/60 rounded-md text-center">{msg}</div>;
}

export const Route = createFileRoute("/author")({
  head: () => ({
    meta: [
      { title: "Author Studio — SaaS Vala Nexus" },
      { name: "description", content: "Build, manage, publish, sell, license, and support your software products end-to-end." },
    ],
  }),
  component: AuthorStudio,
});

type SectionId =
  | "command" | "products" | "builder" | "dev" | "versions" | "docs"
  | "marketplace" | "orders" | "customers" | "licenses" | "subscriptions"
  | "renewals" | "support" | "reviews" | "analytics" | "revenue" | "payouts"
  | "marketing" | "downloads" | "seo" | "ai-coach" | "ai-content" | "health"
  | "competitors" | "roadmap" | "achievements" | "trophies" | "hall" | "map"
  | "chat" | "notifications" | "settings";

const SECTIONS: { id: SectionId; label: string; icon: any; group: string }[] = [
  { id: "command", label: "Command Center", icon: LayoutDashboard, group: "Overview" },
  { id: "products", label: "Product Factory", icon: Package, group: "Build" },
  { id: "builder", label: "Product Builder", icon: Hammer, group: "Build" },
  { id: "dev", label: "Development", icon: GitBranch, group: "Build" },
  { id: "versions", label: "Version Control", icon: GitBranch, group: "Build" },
  { id: "docs", label: "Documentation", icon: BookOpen, group: "Build" },
  { id: "marketplace", label: "Marketplace", icon: Store, group: "Sell" },
  { id: "orders", label: "Orders", icon: ShoppingCart, group: "Sell" },
  { id: "customers", label: "Customers", icon: Users, group: "Sell" },
  { id: "licenses", label: "Licenses", icon: KeyRound, group: "Sell" },
  { id: "subscriptions", label: "Subscriptions", icon: Repeat, group: "Sell" },
  { id: "renewals", label: "Renewals", icon: CalendarClock, group: "Sell" },
  { id: "support", label: "Support", icon: LifeBuoy, group: "Care" },
  { id: "reviews", label: "Reviews", icon: Star, group: "Care" },
  { id: "analytics", label: "Analytics", icon: BarChart3, group: "Insights" },
  { id: "revenue", label: "Revenue", icon: DollarSign, group: "Money" },
  { id: "payouts", label: "Payouts", icon: Wallet, group: "Money" },
  { id: "marketing", label: "Marketing", icon: Megaphone, group: "Grow" },
  { id: "downloads", label: "Downloads", icon: Download, group: "Grow" },
  { id: "seo", label: "SEO", icon: Search, group: "Grow" },
  { id: "ai-coach", label: "AI Product Coach", icon: Sparkles, group: "AI" },
  { id: "ai-content", label: "AI Content", icon: FileText, group: "AI" },
  { id: "health", label: "Product Health", icon: HeartPulse, group: "Insights" },
  { id: "competitors", label: "Competitors", icon: Swords, group: "Insights" },
  { id: "roadmap", label: "Roadmap", icon: MapIcon, group: "Build" },
  { id: "achievements", label: "Achievements", icon: Award, group: "Brand" },
  { id: "trophies", label: "Trophy Room", icon: Trophy, group: "Brand" },
  { id: "hall", label: "Hall of Fame", icon: Crown, group: "Brand" },
  { id: "map", label: "Global Map", icon: Globe, group: "Insights" },
  { id: "chat", label: "Internal Chat", icon: MessageSquare, group: "Comms" },
  { id: "notifications", label: "Notifications", icon: Bell, group: "Comms" },
  { id: "settings", label: "Settings", icon: Settings, group: "System" },
];

function AuthorStudio() {
  const [section, setSection] = useState<SectionId>("command");
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const filtered = SECTIONS.filter((s) =>
      !query || s.label.toLowerCase().includes(query.toLowerCase())
    );
    const map = new Map<string, typeof SECTIONS>();
    for (const s of filtered) {
      if (!map.has(s.group)) map.set(s.group, [] as any);
      map.get(s.group)!.push(s);
    }
    return Array.from(map.entries());
  }, [query]);

  const current = SECTIONS.find((s) => s.id === section)!;

  return (
    <AppShell>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Author Studio</h1>
            <Badge variant="secondary" className="ml-1">Publisher</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Create, manage, sell, license, support and scale your software products — end-to-end.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-1.5" />Submit Product</Button>
          <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Create Product</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mt-2">
        {/* Inner sidebar */}
        <Card className="col-span-12 lg:col-span-3 xl:col-span-2 h-[calc(100vh-220px)] sticky top-20">
          <div className="p-3 border-b border-border/60">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find center…"
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100%-56px)]">
            <div className="p-2 space-y-3">
              {grouped.map(([group, items]) => (
                <div key={group}>
                  <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{group}</div>
                  <div className="space-y-0.5">
                    {items.map((s) => {
                      const Icon = s.icon;
                      const active = s.id === section;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSection(s.id)}
                          className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left transition ${active ? "bg-primary/15 text-foreground font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Content */}
        <div className="col-span-12 lg:col-span-9 xl:col-span-10 space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Author Studio</span>
            <span className="opacity-50">/</span>
            <span>{current.group}</span>
            <span className="opacity-50">/</span>
            <span className="text-foreground font-medium">{current.label}</span>
          </div>
          <SectionRouter id={section} />
        </div>
      </div>
    </AppShell>
  );
}

/* ---------------- Sections ---------------- */

function SectionRouter({ id }: { id: SectionId }) {
  switch (id) {
    case "command": return <CommandCenter />;
    case "products": return <ProductFactory />;
    case "builder": return <ProductBuilder />;
    case "dev": return <DevCenter />;
    case "versions": return <VersionsCenter />;
    case "docs": return <DocsCenter />;
    case "marketplace": return <MarketplaceCenter />;
    case "orders": return <OrdersCenter />;
    case "customers": return <CustomersCenter />;
    case "licenses": return <LicensesCenter />;
    case "subscriptions": return <SubscriptionsCenter />;
    case "renewals": return <RenewalsCenter />;
    case "support": return <SupportCenter />;
    case "reviews": return <ReviewsCenter />;
    case "analytics": return <AnalyticsCenter />;
    case "revenue": return <RevenueCenter />;
    case "payouts": return <PayoutsCenter />;
    case "marketing": return <MarketingCenter />;
    case "downloads": return <DownloadsCenter />;
    case "seo": return <SeoCenter />;
    case "ai-coach": return <AICoach />;
    case "ai-content": return <AIContent />;
    case "health": return <HealthCenter />;
    case "competitors": return <CompetitorsCenter />;
    case "roadmap": return <RoadmapCenter />;
    case "achievements": return <AchievementsCenter />;
    case "trophies": return <TrophyRoom />;
    case "hall": return <HallOfFame />;
    case "map": return <GlobalMap />;
    case "chat": return <InternalChat />;
    case "notifications": return <NotificationsCenter />;
    case "settings": return <SettingsCenter />;
  }
}

/* ---------- shared bits ---------- */
function KPI({ label, value, delta, icon: Icon, tone = "default" }: { label: string; value: string; delta?: string; icon: any; tone?: "default" | "good" | "warn" | "bad" }) {
  const toneCls = tone === "good" ? "text-success" : tone === "warn" ? "text-warning" : tone === "bad" ? "text-destructive" : "text-primary";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{label}</div>
          <Icon className={`h-4 w-4 ${toneCls}`} />
        </div>
        <div className="mt-1 text-2xl font-bold">{value}</div>
        {delta && <div className={`text-xs ${toneCls} mt-0.5`}>{delta}</div>}
      </CardContent>
    </Card>
  );
}

function SimpleTable({ columns, rows }: { columns: { key: string; label: string }[]; rows: Record<string, any>[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>{columns.map((c) => <th key={c.key} className="text-left font-medium px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground">{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border/60 hover:bg-accent/40">
              {columns.map((c) => <td key={c.key} className="px-3 py-2">{r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PanelTitle({ icon: Icon, title, action }: { icon: any; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {action}
    </div>
  );
}

/* ---------- 01 Command Center ---------- */
function CommandCenter() {
  const products = useAuthorProducts();
  const orders = useAuthorOrders();
  const licenses = useAuthorLicenses();
  const renewals = useAuthorRenewals();
  const revenue = useAuthorRevenue();
  const reviews = useAuthorReviews();

  const productsArr = products.data ?? [];
  const ordersArr = orders.data ?? [];
  const licensesArr = licenses.data ?? [];
  const renewalsArr = renewals.data ?? [];
  const revenueArr = revenue.data ?? [];
  const reviewsArr = reviews.data ?? [];

  const now = Date.now();
  const monthAgo = now - 30 * 24 * 3600 * 1000;
  const mtdRevenue = sum(revenueArr.filter((r: any) => new Date(r.occurred_at).getTime() >= monthAgo), (r: any) => r.amount_cents);
  const renewals30 = renewalsArr.filter((r: any) => new Date(r.renewed_at).getTime() >= monthAgo);
  const avgRating = reviewsArr.length ? (sum(reviewsArr, (r: any) => r.rating) / reviewsArr.length).toFixed(1) : "—";
  const active = productsArr.filter((p: any) => p.status === "published").length;
  const pending = productsArr.filter((p: any) => p.status === "review").length;
  const activeLicenses = licensesArr.filter((l: any) => l.status === "active").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="Total Products" value={num(productsArr.length)} icon={Package} />
        <KPI label="Active" value={num(active)} delta={productsArr.length ? `${Math.round((active / productsArr.length) * 100)}% live` : undefined} icon={CheckCircle2} tone="good" />
        <KPI label="Pending Review" value={num(pending)} icon={Clock} tone="warn" />
        <KPI label="Orders" value={num(ordersArr.length)} icon={ShoppingCart} />
        <KPI label="Active Licenses" value={num(activeLicenses)} icon={KeyRound} />
        <KPI label="Renewals (30d)" value={num(renewals30.length)} delta={money(sum(renewals30, (r: any) => r.amount_cents))} icon={CalendarClock} />
        <KPI label="Revenue (MTD)" value={money(mtdRevenue)} icon={DollarSign} tone="good" />
        <KPI label="Revenue (Total)" value={money(sum(revenueArr, (r: any) => r.amount_cents))} icon={TrendingUp} />
        <KPI label="Avg Rating" value={String(avgRating)} delta={reviewsArr.length ? `${num(reviewsArr.length)} reviews` : undefined} icon={Star} tone="good" />
        <KPI label="Reviews" value={num(reviewsArr.length)} icon={Star} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-8">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI Insights</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {productsArr.length === 0 ? (
              <Empty msg="Create your first product to unlock AI insights." />
            ) : (
              <>
                <div className="flex items-start gap-2 p-3 rounded-md bg-success/10 border border-success/30"><TrendingUp className="h-4 w-4 text-success mt-0.5" /><div><div className="font-medium">Revenue tracked</div><div className="text-muted-foreground text-xs">{money(sum(revenueArr, (r: any) => r.amount_cents))} across {num(revenueArr.length)} events.</div></div></div>
                <div className="flex items-start gap-2 p-3 rounded-md bg-primary/10 border border-primary/30"><Rocket className="h-4 w-4 text-primary mt-0.5" /><div><div className="font-medium">{num(productsArr.length)} products in catalog</div><div className="text-muted-foreground text-xs">{active} published · {pending} in review.</div></div></div>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-12 lg:col-span-4">
          <CardHeader><CardTitle className="text-base">Risk Analysis</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <RiskBar label="Refund rate" value={ordersArr.length ? Math.round((ordersArr.filter((o: any) => o.status === "refunded").length / ordersArr.length) * 100) : 0} tone="good" />
            <RiskBar label="Expired licenses" value={licensesArr.length ? Math.round((licensesArr.filter((l: any) => l.status === "expired").length / licensesArr.length) * 100) : 0} tone="warn" />
            <RiskBar label="Past-due subs" value={0} tone="good" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function RiskBar({ label, value, tone }: { label: string; value: number; tone: "good" | "warn" | "bad" }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span>{label}</span><span className="text-muted-foreground">{value}%</span></div>
      <Progress value={value} className={tone === "warn" ? "[&>div]:bg-warning" : tone === "bad" ? "[&>div]:bg-destructive" : "[&>div]:bg-success"} />
    </div>
  );
}

/* ---------- 02 Product Factory ---------- */
function ProductFactory() {
  const [tab, setTab] = useState<string>("all");
  const tabs: { id: string; label: string }[] = [
    { id: "all", label: "All" },
    { id: "draft", label: "Draft" },
    { id: "review", label: "In Review" },
    { id: "published", label: "Published" },
    { id: "archived", label: "Archived" },
  ];
  const { data: products = [], isLoading } = useAuthorProducts();
  const { data: orders = [] } = useAuthorOrders();
  const { data: revenue = [] } = useAuthorRevenue();
  const [creating, setCreating] = useState(false);

  const filtered = tab === "all" ? products : products.filter((p: any) => p.status === tab);
  const rows = filtered.map((p: any) => {
    const productRevenue = sum(revenue.filter((r: any) => r.product_id === p.id), (r: any) => r.amount_cents);
    const productOrders = orders.filter((o: any) => o.product_id === p.id).length;
    return {
      name: <div className="font-medium">{p.name}</div>,
      category: p.category ?? "—",
      price: money(p.price_cents, p.currency),
      status: <Badge variant={p.status === "published" ? "default" : "secondary"}>{p.status}</Badge>,
      orders: num(productOrders),
      revenue: money(productRevenue, p.currency),
      actions: <ProductActions />,
    };
  });

  return (
    <div className="space-y-4">
      <PanelTitle icon={Package} title="Product Factory" action={
        <Button size="sm" className="gap-1.5" onClick={() => setCreating((v) => !v)}><Plus className="h-4 w-4" />Create Product</Button>
      } />
      {creating && <CreateProductForm onDone={() => setCreating(false)} />}
      <div className="flex gap-1.5 flex-wrap">
        {tabs.map((t) => (
          <Button key={t.id} variant={tab === t.id ? "default" : "outline"} size="sm" className="h-7 text-xs" onClick={() => setTab(t.id)}>{t.label}</Button>
        ))}
      </div>
      {isLoading ? <Loading /> : rows.length === 0 ? <Empty msg="No products yet. Click Create Product to add one." /> : (
        <SimpleTable
          columns={[
            { key: "name", label: "Product" }, { key: "category", label: "Category" }, { key: "price", label: "Price" },
            { key: "status", label: "Status" }, { key: "orders", label: "Orders" }, { key: "revenue", label: "Revenue" }, { key: "actions", label: "" },
          ]}
          rows={rows}
        />
      )}
    </div>
  );
}

function CreateProductForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("0");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Sign in required.");
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 6);
      const { error } = await supabase.from("author_products").insert({
        owner_id: u.user.id,
        name,
        slug,
        category: category || null,
        price_cents: Math.round(Number(price || "0") * 100),
        status: "draft",
      });
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["author", "products"] });
      onDone();
    } catch (e: any) {
      setErr(e.message);
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 rounded-md border border-border/60 bg-card">
      <Input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <Input placeholder="Price (USD)" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={busy || !name}>{busy ? "Creating…" : "Create"}</Button>
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>Cancel</Button>
      </div>
      {err && <div className="md:col-span-4 text-xs text-destructive">{err}</div>}
    </form>
  );
}


function ProductActions() {
  return (
    <div className="flex gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit3 className="h-3.5 w-3.5" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7"><Rocket className="h-3.5 w-3.5" /></Button>
    </div>
  );
}


/* ---------- 03 Product Builder ---------- */
function ProductBuilder() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={Hammer} title="Product Builder" action={<Button size="sm"><CheckCircle2 className="h-4 w-4 mr-1.5" />Save Draft</Button>} />
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-8">
          <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Product Name" placeholder="Nexus Pro" />
            <Field label="Category" placeholder="ERP" />
            <Field label="Industry" placeholder="SaaS" />
            <Field label="Version" placeholder="1.0.0" />
            <div className="col-span-2"><Field label="Description" placeholder="One-line pitch…" /></div>
            <div className="col-span-2"><Field label="Features (comma separated)" placeholder="Multi-tenant, RBAC, AI Copilot…" /></div>
            <div className="col-span-2"><Field label="Requirements" placeholder="Node 18+, Postgres 14+" /></div>
          </CardContent>
        </Card>
        <Card className="col-span-12 lg:col-span-4">
          <CardHeader><CardTitle className="text-base">Media</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <UploadBox label="Screenshots" hint="PNG/JPG, up to 10 files" />
            <UploadBox label="Videos" hint="MP4 or YouTube link" />
            <Field label="Demo URL" placeholder="https://demo.example.com" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function Field({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="block">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <Input placeholder={placeholder} className="h-9" />
    </label>
  );
}
function UploadBox({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="rounded-md border border-dashed border-border p-4 text-center hover:bg-accent/40 transition cursor-pointer">
      <Upload className="h-5 w-5 mx-auto text-muted-foreground" />
      <div className="text-sm font-medium mt-1">{label}</div>
      <div className="text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

/* ---------- 04 Dev Center ---------- */
function DevCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={GitBranch} title="Development Center" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <KPI label="Open Tasks" value="34" icon={Hammer} />
        <KPI label="Milestones" value="6" icon={Rocket} />
        <KPI label="Open Bugs" value="11" icon={AlertTriangle} tone="warn" />
      </div>
      <SimpleTable
        columns={[{ key: "title", label: "Item" }, { key: "type", label: "Type" }, { key: "status", label: "Status" }, { key: "assignee", label: "Assignee" }]}
        rows={[
          { title: "Multi-currency invoices", type: "Feature", status: <Badge>In Progress</Badge>, assignee: "Sarah" },
          { title: "PDF export crash", type: "Bug", status: <Badge variant="destructive">Open</Badge>, assignee: "Ahmed" },
          { title: "Stripe webhook retry", type: "Task", status: <Badge variant="secondary">Review</Badge>, assignee: "Lin" },
        ]}
      />
    </div>
  );
}

/* ---------- 05 Versions ---------- */
function VersionsCenter() {
  const { data: versions = [], isLoading } = useAuthorVersions();
  const rows = versions.map((v: any) => ({
    v: v.version,
    product: v.author_products?.name ?? "—",
    date: fmtDate(v.released_at),
    size: v.file_size ? `${(v.file_size / 1_000_000).toFixed(1)} MB` : "—",
    changelog: <span className="text-xs text-muted-foreground line-clamp-1">{v.changelog ?? "—"}</span>,
  }));
  return (
    <div className="space-y-4">
      <PanelTitle icon={GitBranch} title="Version Control" />
      {isLoading ? <Loading /> : rows.length === 0 ? <Empty msg="No releases yet." /> : (
        <SimpleTable
          columns={[{ key: "v", label: "Version" }, { key: "product", label: "Product" }, { key: "date", label: "Released" }, { key: "size", label: "Size" }, { key: "changelog", label: "Changelog" }]}
          rows={rows}
        />
      )}
    </div>
  );
}


/* ---------- 06 Docs ---------- */
function DocsCenter() {
  const docs = [
    { t: "User Guide", icon: BookOpen, count: "42 pages" },
    { t: "Admin Guide", icon: BookOpen, count: "18 pages" },
    { t: "API Guide", icon: FileText, count: "120 endpoints" },
    { t: "Installation Guide", icon: FileText, count: "12 pages" },
    { t: "Video Tutorials", icon: Mic, count: "26 videos" },
    { t: "FAQs", icon: BookOpen, count: "84 entries" },
  ];
  return (
    <div className="space-y-4">
      <PanelTitle icon={BookOpen} title="Documentation Center" action={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New Doc</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {docs.map((d) => (
          <Card key={d.t} className="hover:border-primary/50 transition cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-primary/10 grid place-items-center"><d.icon className="h-5 w-5 text-primary" /></div>
              <div><div className="font-medium text-sm">{d.t}</div><div className="text-xs text-muted-foreground">{d.count}</div></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- 07 Marketplace ---------- */
function MarketplaceCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={Store} title="Marketplace Center" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="Status" value="Live" icon={CheckCircle2} tone="good" />
        <KPI label="Featured" value="Yes" delta="Until Jul 1" icon={Flame} tone="good" />
        <KPI label="Trending" value="#3" delta="Category: ERP" icon={TrendingUp} tone="good" />
        <KPI label="Category Rank" value="#3 / 142" icon={Trophy} />
        <KPI label="Search Rank" value="#1" delta="Keyword: ERP SaaS" icon={Search} tone="good" />
      </div>
    </div>
  );
}

/* ---------- 08 Orders ---------- */
function OrdersCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={ShoppingCart} title="Order Center" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Completed" value="1,842" icon={CheckCircle2} tone="good" />
        <KPI label="Pending" value="24" icon={Clock} tone="warn" />
        <KPI label="Refunded" value="12" icon={AlertTriangle} />
        <KPI label="Cancelled" value="6" icon={AlertTriangle} />
      </div>
      <SimpleTable
        columns={[{ key: "id", label: "Order" }, { key: "customer", label: "Customer" }, { key: "product", label: "Product" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }]}
        rows={[
          { id: "#ORD-10421", customer: "Acme Corp", product: "Nexus Pro Annual", amount: "$1,200", status: <Badge>Completed</Badge> },
          { id: "#ORD-10422", customer: "Globex", product: "Vala CRM Monthly", amount: "$49", status: <Badge variant="secondary">Pending</Badge> },
          { id: "#ORD-10423", customer: "Initech", product: "Nexus Pro Lifetime", amount: "$2,400", status: <Badge>Completed</Badge> },
        ]}
      />
    </div>
  );
}

/* ---------- 09 Customers ---------- */
function CustomersCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={Users} title="Customer Center" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Total" value="3,842" icon={Users} />
        <KPI label="VIP" value="184" icon={Star} tone="good" />
        <KPI label="Enterprise" value="42" icon={Crown} />
        <KPI label="Active 30d" value="2,118" icon={TrendingUp} />
      </div>
      <SimpleTable
        columns={[{ key: "name", label: "Customer" }, { key: "tier", label: "Tier" }, { key: "products", label: "Products" }, { key: "spend", label: "Lifetime" }, { key: "last", label: "Last seen" }]}
        rows={[
          { name: "Acme Corp", tier: <Badge>Enterprise</Badge>, products: "3", spend: "$24,800", last: "2h ago" },
          { name: "Globex", tier: <Badge variant="secondary">VIP</Badge>, products: "2", spend: "$8,420", last: "1d ago" },
          { name: "Initech", tier: <Badge variant="outline">Standard</Badge>, products: "1", spend: "$1,200", last: "5d ago" },
        ]}
      />
    </div>
  );
}


/* ---------- 10 Licenses ---------- */
function LicensesCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={KeyRound} title="License Center" action={<Button size="sm">Generate License</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="Generated" value="5,210" icon={KeyRound} />
        <KPI label="Active" value="4,180" icon={CheckCircle2} tone="good" />
        <KPI label="Expired" value="412" icon={Clock} tone="warn" />
        <KPI label="Transferred" value="84" icon={GitBranch} />
        <KPI label="Renewed" value="534" icon={Repeat} tone="good" />
      </div>
    </div>
  );
}

/* ---------- 11 Subscriptions ---------- */
function SubscriptionsCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={Repeat} title="Subscription Center" />
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <KPI label="Monthly" value="1,204" icon={CalendarClock} />
        <KPI label="Yearly" value="812" icon={CalendarClock} />
        <KPI label="Lifetime" value="148" icon={Crown} />
        <KPI label="Enterprise" value="42" icon={Crown} />
        <KPI label="Trials" value="96" icon={Clock} tone="warn" />
        <KPI label="Renewals" value="534" icon={Repeat} tone="good" />
      </div>
    </div>
  );
}

/* ---------- 12 Renewals ---------- */
function RenewalsCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={CalendarClock} title="Renewal Center" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Upcoming 30d" value="184" delta="$24,800" icon={CalendarClock} />
        <KPI label="Expired" value="42" icon={AlertTriangle} tone="warn" />
        <KPI label="Renewal Revenue MTD" value="$18,200" icon={DollarSign} tone="good" />
        <KPI label="Forecast 90d" value="$72,400" icon={TrendingUp} tone="good" />
      </div>
    </div>
  );
}

/* ---------- 13 Support ---------- */
function SupportCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={LifeBuoy} title="Support Center" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="Open Tickets" value="14" icon={LifeBuoy} tone="warn" />
        <KPI label="Feature Requests" value="62" icon={Sparkles} />
        <KPI label="Bug Reports" value="11" icon={AlertTriangle} tone="warn" />
        <KPI label="Questions" value="38" icon={MessageSquare} />
        <KPI label="Escalations" value="3" icon={Flame} tone="bad" />
      </div>
      <SimpleTable
        columns={[{ key: "id", label: "Ticket" }, { key: "subject", label: "Subject" }, { key: "customer", label: "Customer" }, { key: "priority", label: "Priority" }, { key: "status", label: "Status" }]}
        rows={[
          { id: "#TKT-882", subject: "License key not received", customer: "Globex", priority: <Badge variant="destructive">High</Badge>, status: <Badge>Open</Badge> },
          { id: "#TKT-881", subject: "Feature request: SSO", customer: "Acme Corp", priority: <Badge variant="secondary">Normal</Badge>, status: <Badge variant="outline">Triage</Badge> },
        ]}
      />
    </div>
  );
}

/* ---------- 14 Reviews ---------- */
function ReviewsCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={Star} title="Review Center" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Avg Rating" value="4.7" delta="1,204 reviews" icon={Star} tone="good" />
        <KPI label="5★" value="812" icon={Star} tone="good" />
        <KPI label="4★" value="284" icon={Star} />
        <KPI label="≤3★" value="108" icon={Star} tone="warn" />
      </div>
      <Card>
        <CardContent className="p-4 space-y-3 text-sm">
          {[
            { u: "Sarah K.", r: 5, c: "Nexus Pro saved us months of dev time. The AI copilot is uncanny." },
            { u: "James L.", r: 4, c: "Solid product, onboarding could be smoother." },
            { u: "Ava M.", r: 2, c: "Install docs are outdated for v4.2." },
          ].map((rv) => (
            <div key={rv.u} className="flex gap-3 p-3 rounded-md border border-border/60">
              <Avatar className="h-9 w-9"><AvatarFallback>{rv.u.charAt(0)}</AvatarFallback></Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2"><div className="font-medium">{rv.u}</div><div className="text-warning text-xs">{"★".repeat(rv.r)}{"☆".repeat(5 - rv.r)}</div></div>
                <p className="text-muted-foreground text-xs mt-0.5">{rv.c}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- 15 Analytics ---------- */
function AnalyticsCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={BarChart3} title="Analytics Center" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {["Sales", "Customers", "Licenses", "Renewals", "Support", "Traffic"].map((k) => (
          <Card key={k}><CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">{k} Analytics</div>
            <div className="h-24 rounded-md bg-gradient-to-tr from-primary/20 to-primary/5 grid place-items-center text-xs text-muted-foreground">Chart</div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- 16 Revenue ---------- */
function RevenueCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={DollarSign} title="Revenue Center" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="Total" value="$418,200" icon={DollarSign} tone="good" />
        <KPI label="MTD" value="$48,219" delta="+22%" icon={TrendingUp} tone="good" />
        <KPI label="YTD" value="$284,420" icon={DollarSign} />
        <KPI label="Forecast 90d" value="$172,000" icon={TrendingUp} tone="good" />
        <KPI label="Top Product" value="Nexus Pro" delta="62% share" icon={Crown} />
      </div>
    </div>
  );
}

/* ---------- 17 Payouts ---------- */
function PayoutsCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={Wallet} title="Payout Center" action={<Button size="sm">Request Withdrawal</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Available" value="$12,840" icon={Wallet} tone="good" />
        <KPI label="Pending" value="$3,210" icon={Clock} tone="warn" />
        <KPI label="Withdrawn YTD" value="$148,200" icon={DollarSign} />
        <KPI label="Tax Held" value="$8,420" icon={FileText} />
      </div>
    </div>
  );
}

/* ---------- 18 Marketing ---------- */
function MarketingCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={Megaphone} title="Marketing Center" action={<Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New Campaign</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Active Coupons" value="6" icon={Megaphone} />
        <KPI label="Live Campaigns" value="3" icon={Rocket} />
        <KPI label="Banners" value="2" icon={Eye} />
        <KPI label="Coupon Redemptions" value="412" icon={CheckCircle2} tone="good" />
      </div>
    </div>
  );
}

/* ---------- 19 Downloads ---------- */
function DownloadsCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={Download} title="Download Center" />
      <SimpleTable
        columns={[{ key: "file", label: "Asset" }, { key: "type", label: "Type" }, { key: "size", label: "Size" }, { key: "downloads", label: "Downloads" }]}
        rows={[
          { file: "nexus-pro-4.2.0.zip", type: "Build", size: "184 MB", downloads: "4,210" },
          { file: "user-guide.pdf", type: "Document", size: "8.2 MB", downloads: "12,840" },
          { file: "hero-banner.png", type: "Marketing", size: "1.4 MB", downloads: "984" },
        ]}
      />
    </div>
  );
}

/* ---------- 20 SEO ---------- */
function SeoCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={Search} title="SEO Center" action={<Button size="sm">Run Audit</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Meta Title" placeholder="Nexus Pro — Enterprise ERP" />
        <Field label="Meta Description" placeholder="Modern AI-first ERP for growing teams." />
        <Field label="Keywords" placeholder="erp, saas, ai erp" />
        <Field label="OpenGraph Image URL" placeholder="https://…/og.png" />
        <Field label="Schema (JSON-LD)" placeholder="{ &quot;@type&quot;: &quot;SoftwareApplication&quot; }" />
        <Field label="Hreflang" placeholder="en, ar, fr" />
      </div>
    </div>
  );
}

/* ---------- 21 AI Coach ---------- */
function AICoach() {
  const tips = [
    { icon: TrendingUp, t: "Improve Conversion", d: "Add a 14-day trial — competitors offering trials convert 38% better.", tone: "good" },
    { icon: Star, t: "Improve Reviews", d: "Auto-request a review 7 days after first successful workflow.", tone: "good" },
    { icon: Search, t: "Improve SEO", d: "Your meta description is missing on 2 product pages.", tone: "warn" },
    { icon: DollarSign, t: "Improve Revenue", d: "Bundle 'Vala CRM + Nexus Pro' — 22% of customers buy both within 60 days.", tone: "good" },
  ] as const;
  return (
    <div className="space-y-4">
      <PanelTitle icon={Sparkles} title="AI Product Coach" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.map((t) => (
          <Card key={t.t}><CardContent className="p-4 flex gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 grid place-items-center shrink-0"><t.icon className="h-4 w-4 text-primary" /></div>
            <div><div className="font-medium text-sm">{t.t}</div><div className="text-xs text-muted-foreground">{t.d}</div></div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- 22 AI Content ---------- */
function AIContent() {
  const gens = ["Description", "Features", "FAQs", "Release Notes", "Marketing Email", "Launch Tweet"];
  return (
    <div className="space-y-4">
      <PanelTitle icon={FileText} title="AI Content Generator" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {gens.map((g) => (
          <Card key={g} className="hover:border-primary/50 transition cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1"><Sparkles className="h-4 w-4 text-primary" /><div className="font-medium text-sm">Generate {g}</div></div>
              <div className="text-xs text-muted-foreground">Tap to draft with AI.</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- 23 Health ---------- */
function HealthCenter() {
  const items = [
    { k: "Revenue Health", v: 92, tone: "good" as const },
    { k: "Customer Health", v: 84, tone: "good" as const },
    { k: "Review Health", v: 76, tone: "warn" as const },
    { k: "Support Health", v: 68, tone: "warn" as const },
    { k: "Performance Health", v: 95, tone: "good" as const },
  ];
  return (
    <div className="space-y-4">
      <PanelTitle icon={HeartPulse} title="Product Health" />
      <Card><CardContent className="p-4 space-y-3">
        {items.map((i) => <RiskBar key={i.k} label={i.k} value={i.v} tone={i.tone} />)}
      </CardContent></Card>
    </div>
  );
}

/* ---------- 24 Competitors ---------- */
function CompetitorsCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={Swords} title="Competitor Center" />
      <SimpleTable
        columns={[{ key: "name", label: "Competitor" }, { key: "rank", label: "Market Rank" }, { key: "price", label: "Pricing" }, { key: "score", label: "Feature Score" }]}
        rows={[
          { name: "OdooFlex", rank: "#1", price: "$$$", score: "82/100" },
          { name: "ZenBiz", rank: "#2", price: "$$", score: "74/100" },
          { name: "Nexus Pro (you)", rank: "#3", price: "$$", score: "88/100" },
        ]}
      />
    </div>
  );
}

/* ---------- 25 Roadmap ---------- */
function RoadmapCenter() {
  const cols = ["Planned", "In Progress", "Testing", "Released"] as const;
  const items = {
    Planned: ["Mobile app", "Audit log v2"],
    "In Progress": ["Multi-currency", "Stripe Tax"],
    Testing: ["SAML SSO"],
    Released: ["AI Copilot", "Bulk import"],
  } as const;
  return (
    <div className="space-y-4">
      <PanelTitle icon={MapIcon} title="Product Roadmap" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cols.map((c) => (
          <Card key={c}><CardHeader className="pb-2"><CardTitle className="text-sm">{c}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {items[c].map((i) => <div key={i} className="text-xs p-2 rounded-md border border-border/60 hover:bg-accent/40">{i}</div>)}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- 26 Achievements ---------- */
function AchievementsCenter() {
  const badges = [
    { t: "First Product", d: "Published your first product", u: true },
    { t: "100 Customers", d: "Reached 100 paying customers", u: true },
    { t: "1,000 Customers", d: "Reached 1,000 paying customers", u: true },
    { t: "Top Rated", d: "Maintained 4.5+ for 30 days", u: true },
    { t: "Champion Author", d: "Top 10 marketplace revenue", u: false },
  ];
  return (
    <div className="space-y-4">
      <PanelTitle icon={Award} title="Achievement Center" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {badges.map((b) => (
          <Card key={b.t} className={b.u ? "border-success/50" : "opacity-60"}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full grid place-items-center ${b.u ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}><Award className="h-5 w-5" /></div>
              <div><div className="font-medium text-sm">{b.t}</div><div className="text-xs text-muted-foreground">{b.d}</div></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- 27 Trophies ---------- */
function TrophyRoom() {
  const trophies = ["First Product", "100 Customers", "1000 Customers", "Revenue $100K", "Top Product 2025", "Champion Author"];
  return (
    <div className="space-y-4">
      <PanelTitle icon={Trophy} title="Trophy Room" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {trophies.map((t, i) => (
          <Card key={t}>
            <CardContent className="p-4 text-center">
              <Trophy className={`h-10 w-10 mx-auto ${i < 4 ? "text-warning" : "text-muted-foreground"}`} />
              <div className="text-xs mt-2 font-medium">{t}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- 28 Hall of Fame ---------- */
function HallOfFame() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={Crown} title="Hall of Fame" />
      <SimpleTable
        columns={[{ key: "rank", label: "#" }, { key: "author", label: "Author" }, { key: "product", label: "Top Product" }, { key: "revenue", label: "Revenue" }, { key: "rating", label: "Rating" }]}
        rows={[
          { rank: "1", author: "ByteForge", product: "OdooFlex", revenue: "$1.2M", rating: "4.9" },
          { rank: "2", author: "Lumina Labs", product: "ZenBiz", revenue: "$820K", rating: "4.8" },
          { rank: "3", author: "You", product: "Nexus Pro", revenue: "$418K", rating: "4.7" },
        ]}
      />
    </div>
  );
}

/* ---------- 29 Global Map ---------- */
function GlobalMap() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={Globe} title="Global Map" />
      <Card><CardContent className="p-4">
        <div className="h-64 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 grid place-items-center text-muted-foreground text-sm">Interactive world map · 84 countries</div>
      </CardContent></Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Countries" value="84" icon={Globe} />
        <KPI label="Top: USA" value="$148K" icon={DollarSign} tone="good" />
        <KPI label="Top: India" value="$72K" icon={DollarSign} />
        <KPI label="Top: UAE" value="$48K" icon={DollarSign} />
      </div>
    </div>
  );
}

/* ---------- 30 Chat ---------- */
function InternalChat() {
  const rooms = ["Marketplace Team", "Support Team", "Vendor Team", "Reseller Team", "Admin Team"];
  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-260px)]">
      <Card className="col-span-12 md:col-span-3"><CardContent className="p-2">
        <div className="text-xs font-semibold uppercase text-muted-foreground px-2 py-1">Rooms</div>
        {rooms.map((r, i) => (
          <button key={r} className={`w-full text-left px-2 py-2 rounded-md text-sm hover:bg-accent ${i === 0 ? "bg-accent" : ""}`}>{r}</button>
        ))}
      </CardContent></Card>
      <Card className="col-span-12 md:col-span-9 flex flex-col">
        <div className="border-b border-border/60 p-3 flex items-center justify-between">
          <div className="font-medium text-sm flex items-center gap-2"><MessageSquare className="h-4 w-4" />Marketplace Team</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Languages className="h-3.5 w-3.5" />Realtime translate</div>
        </div>
        <ScrollArea className="flex-1 p-3 space-y-3">
          <Bubble u="Reviewer" t="Your submission for Pixel POS looks good — awaiting compliance check." />
          <Bubble u="You" t="Thanks, anything I should prep?" me />
          <Bubble u="Reviewer" t="Add a privacy policy URL and you're set." />
        </ScrollArea>
        <Separator />
        <div className="p-2 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8"><Paperclip className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Mic className="h-4 w-4" /></Button>
          <Input placeholder="Message…" className="h-9" />
          <Button size="sm">Send</Button>
        </div>
      </Card>
    </div>
  );
}
function Bubble({ u, t, me }: { u: string; t: string; me?: boolean }) {
  return (
    <div className={`flex gap-2 ${me ? "justify-end" : ""}`}>
      {!me && <Avatar className="h-7 w-7"><AvatarFallback className="text-xs">{u.charAt(0)}</AvatarFallback></Avatar>}
      <div className={`max-w-md rounded-lg px-3 py-2 text-sm ${me ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        {!me && <div className="text-[10px] opacity-70 mb-0.5">{u}</div>}
        {t}
      </div>
    </div>
  );
}

/* ---------- 31 Notifications ---------- */
function NotificationsCenter() {
  const items = [
    { i: ShoppingCart, t: "New order #ORD-10423", d: "Initech bought Nexus Pro Lifetime — $2,400", time: "2m ago" },
    { i: KeyRound, t: "License renewed", d: "Acme Corp renewed Nexus Pro for 12 months", time: "1h ago" },
    { i: Star, t: "New 5★ review", d: "Sarah K. on Nexus Pro", time: "3h ago" },
    { i: LifeBuoy, t: "Ticket escalated", d: "#TKT-882 — License key not received", time: "Today" },
  ];
  return (
    <div className="space-y-4">
      <PanelTitle icon={Bell} title="Notification Center" action={<Button size="sm" variant="outline">Mark all read</Button>} />
      <Card><CardContent className="p-2">
        {items.map((n, i) => (
          <div key={i} className="flex items-start gap-3 p-3 border-b border-border/40 last:border-0 hover:bg-accent/40 rounded-md">
            <div className="h-9 w-9 rounded-md bg-primary/10 grid place-items-center shrink-0"><n.i className="h-4 w-4 text-primary" /></div>
            <div className="flex-1">
              <div className="text-sm font-medium">{n.t}</div>
              <div className="text-xs text-muted-foreground">{n.d}</div>
            </div>
            <div className="text-xs text-muted-foreground">{n.time}</div>
          </div>
        ))}
      </CardContent></Card>
    </div>
  );
}

/* ---------- 32 Settings ---------- */
function SettingsCenter() {
  return (
    <div className="space-y-4">
      <PanelTitle icon={Settings} title="Settings" action={<Button size="sm">Save Changes</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Display Name" placeholder="Your name" />
        <Field label="Company" placeholder="Your company" />
        <Field label="Tax ID / VAT" placeholder="GB123456789" />
        <Field label="Bank IBAN" placeholder="GB29 NWBK 6016 1331 9268 19" />
        <Field label="Language" placeholder="English" />
        <Field label="Currency" placeholder="USD" />
        <div className="md:col-span-2"><Field label="Notification Email" placeholder="you@studio.com" /></div>
      </div>
    </div>
  );
}
