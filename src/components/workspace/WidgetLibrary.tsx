import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, BarChart3, LineChart, AreaChart, Activity, ListTodo, StickyNote, Clock, Sparkles, Table as TableIcon, Gauge } from "lucide-react";
import { WIDGET_CATALOG, type WidgetType } from "./widget-types";

const ICON: Record<WidgetType, any> = {
  kpi: Gauge,
  "chart-line": LineChart,
  "chart-bar": BarChart3,
  "chart-area": AreaChart,
  activity: Activity,
  tasks: ListTodo,
  notes: StickyNote,
  clock: Clock,
  "ai-insights": Sparkles,
  table: TableIcon,
};

export function WidgetLibrary({ onAdd }: { onAdd: (type: WidgetType) => void }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Add widget
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[380px] sm:w-[420px]">
        <SheetHeader>
          <SheetTitle>Widget library</SheetTitle>
        </SheetHeader>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {WIDGET_CATALOG.map((w) => {
            const Icon = ICON[w.type];
            return (
              <Card
                key={w.type}
                role="button"
                tabIndex={0}
                onClick={() => onAdd(w.type)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onAdd(w.type)}
                className="group cursor-pointer p-3 transition-all hover:border-primary/60 hover:shadow-md"
              >
                <div className="mb-2 grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-sm font-semibold">{w.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{w.description}</div>
              </Card>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
