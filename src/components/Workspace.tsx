import { useEffect, useState } from "react";
import { Sparkles, Clock, Pin, TrendingUp, Eye, X, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { modules } from "@/lib/modules";
import { Button } from "./ui/button";

/* ----------- Startup splash screen ------------- */
export function Splash() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1100);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-background animate-fade-out" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
      <div className="text-center">
        <div className="relative mx-auto h-20 w-20">
          <div className="absolute inset-0 rounded-2xl gradient-primary shadow-glow animate-scale-in" />
          <div className="absolute inset-0 grid place-items-center"><Sparkles className="h-10 w-10 text-primary-foreground" /></div>
          <div className="absolute -inset-4 rounded-3xl border-2 border-primary/30 animate-ping" />
        </div>
        <div className="mt-6 text-2xl font-bold text-gradient">SaaS Vala</div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Enterprise Suite</div>
        <div className="mt-6 mx-auto h-0.5 w-40 overflow-hidden rounded bg-muted">
          <div className="h-full gradient-primary animate-[sv-load_1s_ease-in-out]" />
        </div>
      </div>
      <style>{`@keyframes sv-load{from{width:0%}to{width:100%}}`}</style>
    </div>
  );
}

/* ----------- Recently viewed / pinned / suggestions widget ------------- */
const RECENT_KEY = "sv-recent-routes";

export function trackRoute(url: string, title: string) {
  try {
    const cur = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    const next = [{ url, title, t: Date.now() }, ...cur.filter((x: any) => x.url !== url)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
}

export function QuickAccess() {
  const [recent, setRecent] = useState<{ url: string; title: string }[]>([]);
  const [pinned, setPinned] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("sv-pinned") || "[]"); } catch { return []; }
  });
  useEffect(() => {
    const load = () => {
      try { setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]")); } catch {}
    };
    load();
    const i = setInterval(load, 2000);
    return () => clearInterval(i);
  }, []);
  const togglePin = (url: string) => {
    setPinned((p) => {
      const n = p.includes(url) ? p.filter((x) => x !== url) : [...p, url];
      localStorage.setItem("sv-pinned", JSON.stringify(n));
      return n;
    });
  };
  const pinnedMods = modules.filter((m) => pinned.includes(m.url));
  const suggestions = modules.filter((m) => !pinned.includes(m.url) && !recent.find((r) => r.url === m.url)).slice(0, 4);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl gradient-card border border-border/60 p-4">
        <div className="flex items-center gap-2 mb-3"><Pin className="h-4 w-4 text-primary" /><span className="text-sm font-semibold">Pinned Apps</span></div>
        {pinnedMods.length ? (
          <div className="space-y-1">
            {pinnedMods.map((m) => (
              <div key={m.url} className="flex items-center gap-2 group">
                <Link to={m.url} className="flex-1 flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-primary/10 text-sm">
                  <m.icon className="h-3.5 w-3.5 text-primary" />{m.title}
                </Link>
                <button onClick={() => togglePin(m.url)} className="opacity-0 group-hover:opacity-100"><X className="h-3 w-3 text-muted-foreground" /></button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground py-4 text-center">No pinned apps yet. Pin from the App Drawer.</div>
        )}
      </div>

      <div className="rounded-xl gradient-card border border-border/60 p-4">
        <div className="flex items-center gap-2 mb-3"><Clock className="h-4 w-4 text-info" /><span className="text-sm font-semibold">Recently Viewed</span></div>
        {recent.length ? (
          <div className="space-y-1">
            {recent.slice(0, 6).map((r) => (
              <Link key={r.url} to={r.url} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-primary/10 text-sm group">
                <span className="flex items-center gap-2"><Eye className="h-3 w-3 text-muted-foreground" />{r.title}</span>
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground py-4 text-center">Open a module to see history.</div>
        )}
      </div>

      <div className="rounded-xl gradient-card border border-border/60 p-4">
        <div className="flex items-center gap-2 mb-3"><TrendingUp className="h-4 w-4 text-success" /><span className="text-sm font-semibold">Smart Recommendations</span></div>
        <div className="space-y-1">
          {suggestions.map((m) => (
            <div key={m.url} className="flex items-center gap-2 group">
              <Link to={m.url} className="flex-1 flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-primary/10 text-sm">
                <m.icon className="h-3.5 w-3.5 text-success" />
                <span className="flex-1">{m.title}</span>
                <span className="text-[9px] text-muted-foreground">{m.group}</span>
              </Link>
              <button onClick={() => togglePin(m.url)} title="Pin" className="opacity-0 group-hover:opacity-100"><Pin className="h-3 w-3 text-muted-foreground hover:text-primary" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------- Route tracker (auto-record visited routes) ------------- */
import { useRouterState } from "@tanstack/react-router";
export function RouteTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const m = modules.find((x) => x.url === pathname || pathname.startsWith(x.url + "/"));
    if (m) trackRoute(m.url, m.title);
  }, [pathname]);
  return null;
}

/* ----------- Side peek panel (Quick record preview) ------------- */
export function SidePeek({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children?: React.ReactNode }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-[480px] max-w-[92vw] glass border-l border-border/60 shadow-glow animate-slide-in-right overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-border/40 bg-card/90 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-primary">Side Peek</span>
            <span className="text-sm font-semibold">{title}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </>
  );
}

/* ----------- Collaboration cursors (simulated) ------------- */
export function CollabCursors() {
  const [cursors] = useState([
    { name: "Aria", c: "oklch(0.72 0.19 295)", x: 60, y: 30 },
    { name: "Ravi", c: "oklch(0.7 0.18 200)", x: 75, y: 65 },
  ]);
  return (
    <>
      {cursors.map((c) => (
        <div key={c.name} className="pointer-events-none fixed z-30 flex items-start gap-1 transition-all duration-1000" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={c.c}><path d="M2 2l8 20 3-9 9-3z" /></svg>
          <span className="rounded px-1.5 py-0.5 text-[9px] font-medium text-white shadow" style={{ background: c.c }}>{c.name}</span>
        </div>
      ))}
    </>
  );
}
