import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ui, UI_EVENTS } from "@/lib/ui-bus";
import { Keyboard } from "lucide-react";

const shortcuts: { keys: string[]; label: string }[] = [
  { keys: ["⌘", "K"], label: "Open command palette" },
  { keys: ["⌘", "N"], label: "Quick create" },
  { keys: ["⌘", "/"], label: "Toggle keyboard shortcuts" },
  { keys: ["⌘", "B"], label: "Toggle sidebar" },
  { keys: ["⌘", "D"], label: "Toggle density" },
  { keys: ["⌘", "J"], label: "Toggle theme" },
  { keys: ["G", "D"], label: "Go to Dashboard" },
  { keys: ["G", "C"], label: "Go to CRM" },
  { keys: ["G", "I"], label: "Go to Inventory" },
  { keys: ["G", "S"], label: "Go to Settings" },
  { keys: ["?"], label: "Show this help" },
];

export function ShortcutsDialog() {
  const [open, setOpen] = useState(false);
  useEffect(() => ui.on(UI_EVENTS.openShortcuts, () => setOpen((o) => !o)), []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="glass max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-primary" /> Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((s) => (
            <div key={s.label} className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 px-3 py-2">
              <span className="text-sm">{s.label}</span>
              <div className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd key={k} className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{k}</kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
