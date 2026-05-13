import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  side?: "left" | "right";
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function DockPanel({ side = "right", title, children, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = side === "right" ? (open ? ChevronRight : ChevronLeft) : open ? ChevronLeft : ChevronRight;

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-border/60 bg-card/60 transition-[width] duration-200",
        side === "right" ? "border-l" : "border-r",
        open ? "w-72" : "w-10",
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 px-2 py-1.5">
        {open && <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>}
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setOpen((v) => !v)} aria-label={open ? "Collapse panel" : "Expand panel"}>
          <Icon className="h-4 w-4" />
        </Button>
      </div>
      {open && <div className="min-h-0 flex-1 overflow-auto p-2">{children}</div>}
    </aside>
  );
}
