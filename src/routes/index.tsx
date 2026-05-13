import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSession, canSeeGroup } from "@/lib/auth";
import { modules, groups, type ModuleItem } from "@/lib/modules";
import { ui, UI_EVENTS } from "@/lib/ui-bus";
import { SYSTEM_IDENTITY } from "@/lib/system-identity";
import {
  Search,
  Command,
  ArrowRight,
  Sparkles,
  Pin,
  LayoutGrid,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Home — SaaS Vala" }] }),
  component: Home,
});

const PRIORITY_TITLES = [
  "AI Dashboard",
  "Executive",
  "CRM",
  "Sales / ERP",
  "Accounting",
  "Inventory",
  "HRM",
  "Analytics",
  "Notifications",
  "Settings",
];

function Home() {
  const session = useSession();
  const role = session?.role;
  const name = session?.name || "there";
  const [q, setQ] = useState("");

  // Filter modules by what this role can access
  const allowed = useMemo<ModuleItem[]>(() => {
    if (!role) return modules;
    return modules.filter((m) => canSeeGroup(role, m.group));
  }, [role]);

  // Pinned shortcuts — top relevant modules for this role
  const pinned = useMemo<ModuleItem[]>(() => {
    const byTitle = new Map(allowed.map((m) => [m.title, m]));
    const picks: ModuleItem[] = [];
    for (const t of PRIORITY_TITLES) {
      const m = byTitle.get(t);
      if (m) picks.push(m);
      if (picks.length >= 8) break;
    }
    if (picks.length < 8) {
      for (const m of allowed) {
        if (picks.length >= 8) break;
        if (!picks.includes(m)) picks.push(m);
      }
    }
    return picks;
  }, [allowed]);

  // Search filter for the browse-by-category section
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return allowed;
    return allowed.filter(
      (m) =>
        m.title.toLowerCase().includes(needle) ||
        m.group.toLowerCase().includes(needle) ||
        m.desc.toLowerCase().includes(needle),
    );
  }, [q, allowed]);

  const grouped = useMemo(
    () =>
      groups
        .map((g) => ({ group: g, items: filtered.filter((m) => m.group === g) }))
        .filter((g) => g.items.length > 0),
    [filtered],
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Greeting */}
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{SYSTEM_IDENTITY}</span>
            {role && (
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {role.replace(/_/g, " ")}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            Yahan se aap apne saare modules access kar sakte hain. Search karein ya niche category browse karein.
          </p>
        </header>

        {/* Big search → opens command palette */}
        <button
          onClick={() => ui.emit(UI_EVENTS.openCommand)}
          className="group relative block w-full text-left"
          aria-label="Open command palette"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <div className="flex h-14 w-full cursor-pointer items-center rounded-xl border border-border bg-card pl-12 pr-4 text-base text-muted-foreground shadow-sm transition group-hover:border-primary/40 group-hover:shadow-md">
            <span className="flex-1">Search any module, page or action…</span>
            <kbd className="ml-2 inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-0.5 text-xs">
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
        </button>

        {/* Pinned shortcuts for this role */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Pin className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Pinned for you
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {pinned.map((m) => {
              const Icon = m.icon;
              return (
                <Link key={m.url} to={m.url as any}>
                  <Card className="group h-full border-border/60 transition hover:border-primary/50 hover:shadow-md">
                    <CardContent className="flex items-start gap-3 p-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-semibold">{m.title}</span>
                          <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {m.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Browse by category */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">
                Browse by category
              </h2>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter modules in this view…"
                className="h-9 pl-8 text-sm"
              />
            </div>
          </div>

          {grouped.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No modules match "{q}".
                <Button
                  variant="link"
                  size="sm"
                  className="ml-2"
                  onClick={() => setQ("")}
                >
                  Clear filter
                </Button>
              </CardContent>
            </Card>
          )}

          {grouped.map(({ group, items }) => (
            <div key={group} className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group}
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  · {items.length}
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map((m) => {
                  const Icon = m.icon;
                  return (
                    <Link
                      key={m.url}
                      to={m.url as any}
                      className="group flex items-center gap-2.5 rounded-lg border border-border/60 bg-card p-3 text-sm transition hover:border-primary/50 hover:bg-accent/30"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                      <span className="min-w-0 flex-1 truncate">{m.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <footer className="border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
          {modules.length} total modules · {allowed.length} available for your role · Press{" "}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">⌘K</kbd>{" "}
          anywhere to search
        </footer>
      </div>
    </AppShell>
  );
}
