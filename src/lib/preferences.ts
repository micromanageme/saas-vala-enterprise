// Lightweight persistent UI preferences (theme, density, language, region).
import { useEffect, useState } from "react";

type Prefs = {
  theme: "dark" | "light";
  density: "comfortable" | "compact";
  language: "en" | "hi" | "ar" | "es" | "fr";
  region: "Global" | "APAC" | "Americas" | "EMEA";
  rtl: boolean;
};

const KEY = "vala:prefs";
const defaults: Prefs = {
  theme: "dark",
  density: "comfortable",
  language: "en",
  region: "Global",
  rtl: false,
};

function read(): Prefs {
  if (typeof window === "undefined") return defaults;
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { return defaults; }
}

const listeners = new Set<(p: Prefs) => void>();
let current: Prefs = defaults;

function apply(p: Prefs) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.classList.toggle("dark", p.theme === "dark");
  html.classList.toggle("light", p.theme === "light");
  html.classList.toggle("density-compact", p.density === "compact");
  html.dir = p.rtl ? "rtl" : "ltr";
  html.lang = p.language;
}

export function setPrefs(patch: Partial<Prefs>) {
  current = { ...current, ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(current)); } catch {}
  apply(current);
  listeners.forEach((l) => l(current));
}

export function usePrefs(): [Prefs, (p: Partial<Prefs>) => void] {
  const [p, setP] = useState<Prefs>(current);
  useEffect(() => {
    current = read();
    setP(current);
    apply(current);
    const fn = (np: Prefs) => setP(np);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return [p, setPrefs];
}
