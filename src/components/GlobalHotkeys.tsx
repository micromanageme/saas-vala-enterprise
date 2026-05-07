import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ui, UI_EVENTS } from "@/lib/ui-bus";
import { setPrefs } from "@/lib/preferences";
import { toast } from "sonner";

const goMap: Record<string, string> = {
  d: "/dashboard", c: "/crm", i: "/inventory", s: "/settings",
  e: "/erp", h: "/hrm", a: "/accounting", p: "/pos", r: "/reports",
};

export function GlobalHotkeys() {
  const nav = useNavigate();
  useEffect(() => {
    let leader = false;
    let leaderTimer: ReturnType<typeof setTimeout> | null = null;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const inField = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key.toLowerCase() === "n") { e.preventDefault(); ui.emit(UI_EVENTS.openQuickCreate); return; }
      if (mod && e.key === "/") { e.preventDefault(); ui.emit(UI_EVENTS.openShortcuts); return; }
      if (mod && e.key.toLowerCase() === "d") {
        e.preventDefault();
        const compact = document.documentElement.classList.toggle("density-compact");
        setPrefs({ density: compact ? "compact" : "comfortable" });
        toast(`Density: ${compact ? "Compact" : "Comfortable"}`);
        return;
      }
      if (mod && e.key.toLowerCase() === "j") {
        e.preventDefault();
        const isDark = document.documentElement.classList.contains("dark");
        setPrefs({ theme: isDark ? "light" : "dark" });
        toast(`Theme: ${isDark ? "Light" : "Dark"}`);
        return;
      }
      if (inField) return;
      if (e.key === "?") { ui.emit(UI_EVENTS.openShortcuts); return; }

      if (leader && goMap[e.key.toLowerCase()]) {
        nav({ to: goMap[e.key.toLowerCase()] });
        leader = false;
        return;
      }
      if (e.key.toLowerCase() === "g") {
        leader = true;
        if (leaderTimer) clearTimeout(leaderTimer);
        leaderTimer = setTimeout(() => (leader = false), 1000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav]);
  return null;
}
