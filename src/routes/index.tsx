import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
  CornerDownLeft,
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
  // Track when client-side hydration has completed so we know the
  // session lookup is real (not just the SSR `null` fallback).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const isLoading = !mounted;

  const role = session?.role;
  const name = session?.name || "there";

  const allowed = useMemo<ModuleItem[]>(() => {
    if (!role) return modules;
    return modules.filter((m) => canSeeGroup(role, m.group));
  }, [role]);

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

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Greeting */}
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{SYSTEM_IDENTITY}</span>
            {isLoading ? (
              <Skeleton className="ml-1 h-4 w-20" />
            ) : (
              role && (
                <Badge variant="secondary" className="ml-1 text-[10px]">
                  {role.replace(/_/g, " ")}
                </Badge>
              )
            )}
          </div>
          {isLoading ? (
            <>
              <Skeleton className="h-9 w-72" />
              <Skeleton className="h-5 w-96 max-w-full" />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {name.split(" ")[0]}
              </h1>
              <p className="text-muted-foreground">
                Yahan se aap apne saare modules access kar sakte hain. Search
                karein ya niche category browse karein.
              </p>
            </>
          )}
        </header>

        {/* Big search → opens command palette */}
        <button
          onClick={() => ui.emit(UI_EVENTS.openCommand)}
          className="group relative block w-full text-left"
          aria-label="Open command palette"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <div className="flex h-14 w-full cursor-pointer items-center rounded-xl border border-border bg-card pl-12 pr-4 text-base text-muted-foreground shadow-sm transition group-hover:border-primary/40 group-hover:shadow-md">
            <span className="flex-1">
              Search any module, page or action…
            </span>
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
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="border-border/60">
                    <CardContent className="flex items-start gap-3 p-4">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : pinned.map((m) => {
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
                              <span className="truncate font-semibold">
                                {m.title}
                              </span>
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

        {/* Browse by category — with highlight + keyboard nav */}
        {isLoading ? (
          <SkeletonBrowse />
        ) : (
          <BrowseByCategory allowed={allowed} />
        )}

        <footer className="border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
          {isLoading ? (
            <Skeleton className="mx-auto h-3 w-64" />
          ) : (
            <>
              {modules.length} total modules · {allowed.length} available for
              your role · Press{" "}
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
                ⌘K
              </kbd>{" "}
              anywhere to search
            </>
          )}
        </footer>
      </div>
    </AppShell>
  );
}

/* -------------------------------------------------------------------------- */

function SkeletonBrowse() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-9 w-64" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const re = new RegExp(`(${escapeRegExp(query.trim())})`, "ig");
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i) =>
        re.test(p) && p.toLowerCase() === query.trim().toLowerCase() ? (
          <mark
            key={i}
            className="rounded bg-primary/20 px-0.5 text-foreground"
          >
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

const LISTBOX_ID = "browse-modules-listbox";
const optionId = (i: number) => `browse-option-${i}`;

function BrowseByCategory({ allowed }: { allowed: ModuleItem[] }) {
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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
        .map((g) => ({
          group: g,
          items: filtered.filter((m) => m.group === g),
        }))
        .filter((g) => g.items.length > 0),
    [filtered],
  );

  const flatOrder = useMemo(
    () => grouped.flatMap((g) => g.items),
    [grouped],
  );

  // Preserve selection across result changes when possible (by URL),
  // otherwise clamp to a valid index instead of always resetting.
  const prevActiveUrlRef = useRef<string | null>(null);
  useEffect(() => {
    const prevUrl = prevActiveUrlRef.current;
    if (prevUrl) {
      const found = flatOrder.findIndex((m) => m.url === prevUrl);
      if (found >= 0) {
        setActiveIdx(found);
        return;
      }
    }
    setActiveIdx((i) => {
      if (flatOrder.length === 0) return 0;
      return Math.min(Math.max(i, 0), flatOrder.length - 1);
    });
  }, [flatOrder]);

  // Track the current selection URL so we can re-find it after filter changes.
  useEffect(() => {
    prevActiveUrlRef.current = flatOrder[activeIdx]?.url ?? null;
  }, [activeIdx, flatOrder]);

  // Keep the active item visible
  useEffect(() => {
    const el = itemRefs.current[activeIdx];
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const move = (delta: number) => {
    if (flatOrder.length === 0) return;
    setActiveIdx((i) => {
      const n = flatOrder.length;
      return ((i + delta) % n + n) % n;
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (flatOrder.length) setActiveIdx(0);
    } else if (e.key === "End") {
      e.preventDefault();
      if (flatOrder.length) setActiveIdx(flatOrder.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = flatOrder[activeIdx];
      if (target) navigate({ to: target.url as any });
    } else if (e.key === "Escape") {
      if (q) {
        e.preventDefault();
        setQ("");
      }
    }
  };

  let runningIdx = -1;
  const activeItem = flatOrder[activeIdx];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-primary" />
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            id="browse-modules-label"
          >
            Browse by category
          </h2>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Filter modules… (↑↓ + Enter)"
            className="h-9 pl-8 pr-16 text-sm"
            role="combobox"
            aria-label="Filter modules"
            aria-expanded={flatOrder.length > 0}
            aria-controls={LISTBOX_ID}
            aria-autocomplete="list"
            aria-activedescendant={
              activeItem ? optionId(activeIdx) : undefined
            }
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            <CornerDownLeft className="h-3 w-3" />
          </kbd>
        </div>
      </div>

      {/* Live region announces the active selection to screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        {activeItem
          ? `${activeItem.title}, ${activeItem.group}, ${activeIdx + 1} of ${flatOrder.length}`
          : q
            ? `No modules match ${q}`
            : ""}
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

      <div
        id={LISTBOX_ID}
        role="listbox"
        aria-labelledby="browse-modules-label"
        className="space-y-4"
      >
        {grouped.map(({ group, items }) => (
          <div
            key={group}
            role="group"
            aria-label={group}
            className="space-y-2"
          >
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
                runningIdx += 1;
                const idx = runningIdx;
                const Icon = m.icon;
                const isActive = idx === activeIdx;
                return (
                  <Link
                    key={m.url}
                    to={m.url as any}
                    id={optionId(idx)}
                    role="option"
                    aria-selected={isActive}
                    tabIndex={-1}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onFocus={() => setActiveIdx(idx)}
                    className={`group flex items-center gap-2.5 rounded-lg border p-3 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? "border-primary/60 bg-accent/40 ring-1 ring-primary/30"
                        : "border-border/60 bg-card hover:border-primary/50 hover:bg-accent/30"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 truncate">
                      <Highlight text={m.title} query={q} />
                    </span>
                    <ArrowRight
                      className={`h-3.5 w-3.5 shrink-0 transition ${
                        isActive
                          ? "text-primary opacity-100"
                          : "text-muted-foreground opacity-0 group-hover:opacity-100"
                      }`}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
