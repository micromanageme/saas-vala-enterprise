import { memo, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical, X, TrendingUp, Sparkles, Clock as ClockIcon, Activity as ActivityIcon, CheckCircle2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import type { WidgetConfig } from "./widget-types";

const trend = Array.from({ length: 12 }, (_, i) => ({
  name: `T${i + 1}`,
  value: Math.round(40 + Math.sin(i / 2) * 15 + i * 3 + Math.random() * 8),
}));

const bars = Array.from({ length: 6 }, (_, i) => ({
  name: ["A", "B", "C", "D", "E", "F"][i],
  value: Math.round(30 + Math.random() * 70),
}));

function ChartWrap({ kind }: { kind: "line" | "bar" | "area" }) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        {kind === "line" ? (
          <LineChart data={trend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        ) : kind === "bar" ? (
          <BarChart data={bars} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <AreaChart data={trend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="wAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#wAreaGrad)" strokeWidth={2} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function KpiBody({ meta }: { meta?: Record<string, any> }) {
  const value = meta?.value ?? "—";
  const delta = meta?.delta ?? "—";
  const up = meta?.up !== false;
  return (
    <div className="flex h-full flex-col justify-center px-4">
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      <div className={`mt-1 flex items-center gap-1 text-xs ${up ? "text-emerald-500" : "text-destructive"}`}>
        <TrendingUp className={`h-3.5 w-3.5 ${up ? "" : "rotate-180"}`} />
        <span>{delta} vs prior</span>
      </div>
    </div>
  );
}

function ActivityBody() {
  const items = [
    { who: "Aria", what: "approved PR #482", when: "2m" },
    { who: "Noah", what: "deployed billing v2.1", when: "11m" },
    { who: "Mia", what: "closed ticket #1209", when: "24m" },
    { who: "Liam", what: "added 3 invoices", when: "1h" },
    { who: "Ivy", what: "rotated API keys", when: "3h" },
  ];
  return (
    <ScrollArea className="h-full px-3 pb-3">
      <ul className="space-y-2 pt-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 rounded-md p-2 text-sm hover:bg-muted/50">
            <ActivityIcon className="mt-0.5 h-4 w-4 text-primary" />
            <div className="flex-1 leading-tight">
              <div><span className="font-medium">{it.who}</span> {it.what}</div>
              <div className="text-xs text-muted-foreground">{it.when} ago</div>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

function TasksBody() {
  const tasks = [
    "Review Q3 forecast",
    "Approve marketing budget",
    "Sign vendor contract",
    "Onboard 3 new analysts",
    "Audit access logs",
  ];
  return (
    <ScrollArea className="h-full px-3 pb-3">
      <ul className="space-y-2 pt-1">
        {tasks.map((t, i) => (
          <li key={i} className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-muted/50">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

function NotesBody() {
  return (
    <div className="h-full p-3">
      <Textarea className="h-full resize-none" placeholder="Capture a thought…" />
    </div>
  );
}

function ClockBody() {
  const zones = [
    { city: "SF", offset: -7 },
    { city: "NY", offset: -4 },
    { city: "LDN", offset: 1 },
    { city: "TYO", offset: 9 },
  ];
  const fmt = (offset: number) => {
    const d = new Date(Date.now() + offset * 3600 * 1000);
    return d.toUTCString().slice(17, 22);
  };
  return (
    <div className="grid h-full grid-cols-2 gap-2 p-3">
      {zones.map((z) => (
        <div key={z.city} className="flex flex-col items-center justify-center rounded-md border border-border/60 bg-card/50">
          <div className="text-xs text-muted-foreground">{z.city}</div>
          <div className="font-mono text-lg font-semibold">{fmt(z.offset)}</div>
        </div>
      ))}
    </div>
  );
}

function AiBody() {
  const insights = [
    "Revenue up 12%, driven by Pro tier adoption.",
    "Churn risk flagged on 3 enterprise accounts.",
    "Support volume trending down — automate top 5 macros.",
  ];
  return (
    <ScrollArea className="h-full px-3 pb-3">
      <ul className="space-y-2 pt-1">
        {insights.map((s, i) => (
          <li key={i} className="flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 p-2 text-sm">
            <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

function TableBody() {
  const rows = Array.from({ length: 6 }, (_, i) => ({
    id: `INV-${1000 + i}`,
    customer: ["Acme", "Globex", "Initech", "Umbrella", "Soylent", "Hooli"][i],
    amount: `$${(Math.random() * 9000 + 1000).toFixed(0)}`,
    status: ["Paid", "Pending", "Overdue"][i % 3],
  }));
  return (
    <ScrollArea className="h-full">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-card">
          <tr className="border-b text-left text-xs uppercase text-muted-foreground">
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Customer</th>
            <th className="px-3 py-2">Amount</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b last:border-0 hover:bg-muted/40">
              <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
              <td className="px-3 py-2">{r.customer}</td>
              <td className="px-3 py-2">{r.amount}</td>
              <td className="px-3 py-2">
                <Badge variant={r.status === "Paid" ? "default" : r.status === "Pending" ? "secondary" : "destructive"}>
                  {r.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}

type WidgetProps = {
  config: WidgetConfig;
  editing?: boolean;
  onRemove?: (id: string) => void;
};

function WidgetInner({ config, editing, onRemove }: WidgetProps) {
  const body = useMemo(() => {
    switch (config.type) {
      case "kpi": return <KpiBody meta={config.meta} />;
      case "chart-line": return <ChartWrap kind="line" />;
      case "chart-bar": return <ChartWrap kind="bar" />;
      case "chart-area": return <ChartWrap kind="area" />;
      case "activity": return <ActivityBody />;
      case "tasks": return <TasksBody />;
      case "notes": return <NotesBody />;
      case "clock": return <ClockBody />;
      case "ai-insights": return <AiBody />;
      case "table": return <TableBody />;
    }
  }, [config]);

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden border-border/70 bg-card/80 shadow-sm backdrop-blur transition-shadow hover:shadow-md">
      <div className="widget-drag-handle flex items-center gap-2 border-b border-border/60 px-3 py-2">
        {editing && <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground active:cursor-grabbing" />}
        {config.type === "clock" && <ClockIcon className="h-4 w-4 text-primary" />}
        <div className="flex-1 truncate text-sm font-semibold">{config.title}</div>
        {editing && onRemove && (
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onRemove(config.id)}
            aria-label="Remove widget"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <div className="min-h-0 flex-1">{body}</div>
    </Card>
  );
}

export const Widget = memo(WidgetInner);
