// Tiny global event bus to connect buttons across the shell.
type Handler = () => void;
const map = new Map<string, Set<Handler>>();

export const ui = {
  on(event: string, h: Handler): () => void {
    if (!map.has(event)) map.set(event, new Set());
    map.get(event)!.add(h);
    return () => { map.get(event)?.delete(h); };
  },
  emit(event: string) {
    map.get(event)?.forEach((h) => h());
  },
};

export const UI_EVENTS = {
  openCommand: "open:command",
  openQuickCreate: "open:quickCreate",
  openShortcuts: "open:shortcuts",
  toggleDensity: "toggle:density",
  toggleTheme: "toggle:theme",
} as const;
