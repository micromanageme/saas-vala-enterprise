import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// react-grid-layout v2 types are loose; pull WidthProvider via default-namespace access.
import RGL from "react-grid-layout";
import { Widget } from "./Widget";
import type { DashboardLayoutItem, WidgetConfig } from "./widget-types";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GridLayout: any = RGL;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResponsiveGrid: any = (RGL as any).WidthProvider
  ? (RGL as any).WidthProvider(GridLayout)
  : GridLayout;

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

  useEffect(() => {
    const t = setTimeout(() => force((n) => n + 1), 0);
    return () => clearTimeout(t);
  }, []);

  const handleChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (next: any[]) => {
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
