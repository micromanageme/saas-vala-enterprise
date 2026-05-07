import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { modules, groups } from "@/lib/modules";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Grid3x3 } from "lucide-react";

export const Route = createFileRoute("/apps")({ component: AppsPage });

function AppsPage() {
  const [q, setQ] = useState("");
  const [g, setG] = useState<string | null>(null);
  const filtered = modules.filter(
    (m) => (!g || m.group === g) && (!q || m.title.toLowerCase().includes(q.toLowerCase()) || m.desc.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <Grid3x3 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Apps</h1>
              <Badge variant="outline" className="border-primary/40 text-primary">{modules.length} modules</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Open any enterprise module — Odoo-style App Drawer.</p>
          </div>
          <div className="relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search apps…" className="pl-9 bg-input/50" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setG(null)} className={`text-xs rounded-full px-3 py-1 border ${!g ? "gradient-primary text-primary-foreground border-transparent" : "border-border hover:border-primary/50"}`}>All</button>
          {groups.map((x) => (
            <button key={x} onClick={() => setG(x)} className={`text-xs rounded-full px-3 py-1 border ${g === x ? "gradient-primary text-primary-foreground border-transparent" : "border-border hover:border-primary/50"}`}>{x}</button>
          ))}
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((m) => (
            <Link key={m.url} to={m.url} className="group rounded-xl gradient-card border border-border/60 p-4 hover:border-primary/60 hover:shadow-glow transition-all hover:-translate-y-0.5">
              <div className="grid h-12 w-12 place-items-center rounded-lg gradient-primary shadow-glow mb-3 group-hover:scale-110 transition-transform">
                <m.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-sm font-semibold">{m.title}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{m.desc}</div>
              <div className="text-[10px] uppercase tracking-wider text-primary mt-2">{m.group}</div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
