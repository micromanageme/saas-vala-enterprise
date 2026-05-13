import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GridLayout, { WidthProvider, type Layout } from "react-grid-layout";
import { Widget } from "./Widget";
import type { DashboardLayoutItem, WidgetConfig } from "./widget-types";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGrid = WidthProvider(GridLayout);

type Props = {
  widgets: WidgetConfig[];
  layout: DashboardLayoutItem[];
  editing: boolean;
  onChange: (layout: DashboardLayoutItem[]) => void;
  onRemove: (id: string) => void;
};

export function DashboardGrid({ widgets, layout, editing, onChange, onRemove }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, force] = useState(0);

  // Force a width recalc once mounted (WidthProvider needs a tick)
  useEffect(() => {
    const t = setTimeout(() => force((n) => n + 1), 0);
    return () => clearTimeout(t);
  }, []);

  const handleChange = useCallback(
    (next: Layout[]) => {
      onChange(
        next.map((l) => ({
          i: l.i,
          x: l.x,
          y: l.y,
          w: l.w,
          h: l.h,
          minW: l.minW,
          minH: l.minH,
        })),
      );
    },
    [onChange],
  );

  const items = useMemo(
    () =>
      widgets.map((w) => (
        <div key={w.id} data-grid={layout.find((l) => l.i === w.id)}>
          <Widget config={w} editing={editing} onRemove={onRemove} />
        </div>
      )),
    [widgets, layout, editing, onRemove],
  );

  return (
    <div ref={containerRef} className="rounded-xl border border-border/60 bg-muted/20 p-2">
      <ResponsiveGrid
        className="layout"
        cols={12}
        rowHeight={48}
        margin={[12, 12]}
        containerPadding={[8, 8]}
        isDraggable={editing}
        isResizable={editing}
        draggableHandle=".widget-drag-handle"
        onLayoutChange={handleChange}
        compactType="vertical"
      >
        {items}
      </ResponsiveGrid>
    </div>
  );
}
