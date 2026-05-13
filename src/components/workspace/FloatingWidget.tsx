import { useEffect, useRef, useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, X, Square } from "lucide-react";

type Props = {
  title: string;
  initial?: { x: number; y: number; w: number; h: number };
  onClose?: () => void;
  children: ReactNode;
};

export function FloatingWidget({ title, initial, onClose, children }: Props) {
  const [pos, setPos] = useState(initial ?? { x: 80, y: 80, w: 360, h: 280 });
  const [collapsed, setCollapsed] = useState(false);
  const drag = useRef<{ ox: number; oy: number; px: number; py: number } | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag.current) return;
      setPos((p) => ({ ...p, x: e.clientX - drag.current!.ox, y: e.clientY - drag.current!.oy }));
    };
    const onUp = () => (drag.current = null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <Card
      className="pointer-events-auto fixed z-50 flex flex-col overflow-hidden border-border/70 bg-card/95 shadow-2xl backdrop-blur animate-in fade-in zoom-in-95"
      style={{ left: pos.x, top: pos.y, width: pos.w, height: collapsed ? 40 : pos.h }}
    >
      <div
        className="flex cursor-grab select-none items-center gap-2 border-b border-border/60 bg-muted/40 px-3 py-2 active:cursor-grabbing"
        onMouseDown={(e) => {
          drag.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y, px: pos.x, py: pos.y };
        }}
      >
        <div className="flex-1 truncate text-sm font-semibold">{title}</div>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setCollapsed((v) => !v)} aria-label="Collapse">
          {collapsed ? <Square className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
        </Button>
        {onClose && (
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onClose} aria-label="Close">
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      {!collapsed && <div className="min-h-0 flex-1 overflow-auto">{children}</div>}
    </Card>
  );
}
