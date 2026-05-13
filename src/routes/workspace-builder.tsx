import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, RotateCcw, Pencil, Eye, PanelRightOpen, Grid3x3, Columns2, Layers } from "lucide-react";
import { DashboardGrid } from "@/components/workspace/DashboardGrid";
import { WidgetLibrary } from "@/components/workspace/WidgetLibrary";
import { WorkspaceTemplates } from "@/components/workspace/WorkspaceTemplates";
import { FloatingWidget } from "@/components/workspace/FloatingWidget";
import { SplitScreen } from "@/components/workspace/SplitScreen";
import { DockPanel } from "@/components/workspace/DockPanel";
import { Widget } from "@/components/workspace/Widget";
import {
  TEMPLATES,
  WIDGET_CATALOG,
  type DashboardLayoutItem,
  type WidgetConfig,
  type WidgetType,
} from "@/components/workspace/widget-types";

export const Route = createFileRoute("/workspace-builder")({
  head: () => ({
    meta: [
      { title: "Workspace Builder — SaaS Vala" },
      { name: "description", content: "Drag-drop dashboard builder, dockable panels, split screen, floating widgets" },
    ],
  }),
  component: Page,
});

const STORAGE_KEY = "sv:workspace:dashboard:v1";

type Saved = { widgets: WidgetConfig[]; layout: DashboardLayoutItem[] };

function loadSaved(): Saved {
  if (typeof window === "undefined") return { widgets: TEMPLATES[0].widgets, layout: TEMPLATES[0].layout };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { widgets: TEMPLATES[0].widgets, layout: TEMPLATES[0].layout };
    const p = JSON.parse(raw) as Saved;
    if (!p.widgets?.length) return { widgets: TEMPLATES[0].widgets, layout: TEMPLATES[0].layout };
    return p;
  } catch {
    return { widgets: TEMPLATES[0].widgets, layout: TEMPLATES[0].layout };
  }
}

function Page() {
  const [editing, setEditing] = useState(true);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [layout, setLayout] = useState<DashboardLayoutItem[]>([]);
  const [floating, setFloating] = useState<WidgetConfig | null>(null);

  useEffect(() => {
    const s = loadSaved();
    setWidgets(s.widgets);
    setLayout(s.layout);
  }, []);

  const addWidget = useCallback((type: WidgetType) => {
    const def = WIDGET_CATALOG.find((w) => w.type === type)!;
    const id = `${type}-${Date.now().toString(36)}`;
    const cfg: WidgetConfig = {
      id,
      type,
      title: def.title,
      meta: type === "kpi" ? { value: "0", delta: "+0", up: true } : undefined,
    };
    setWidgets((ws) => [...ws, cfg]);
    setLayout((l) => [...l, { i: id, x: 0, y: Infinity, w: def.defaultSize.w, h: def.defaultSize.h, minW: 2, minH: 2 }]);
    toast.success(`Added ${def.title}`);
  }, []);

  const removeWidget = useCallback((id: string) => {
    setWidgets((ws) => ws.filter((w) => w.id !== id));
    setLayout((l) => l.filter((x) => x.i !== id));
  }, []);

  const applyTemplate = useCallback((t: (typeof TEMPLATES)[number]) => {
    setWidgets(t.widgets);
    setLayout(t.layout);
    toast.success(`Applied template: ${t.name}`);
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ widgets, layout }));
    toast.success("Workspace saved");
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setWidgets(TEMPLATES[0].widgets);
    setLayout(TEMPLATES[0].layout);
    toast("Reset to default");
  };

  return (
    <AppShell>
      <div className="flex h-full min-h-[calc(100vh-3.5rem)] flex-col">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border/60 bg-card/40 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight">Workspace Builder</h1>
            <Badge variant="outline" className="gap-1"><Layers className="h-3 w-3" /> {widgets.length} widgets</Badge>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <WorkspaceTemplates onApply={applyTemplate} />
            <WidgetLibrary onAdd={addWidget} />
            <Button size="sm" variant="outline" onClick={() => setEditing((v) => !v)} className="gap-1.5">
              {editing ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              {editing ? "Preview" : "Edit"}
            </Button>
            <Button size="sm" variant="outline" onClick={reset} className="gap-1.5">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button size="sm" onClick={save} className="gap-1.5">
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </div>

        {/* Body — Split layout: dock left + main + dock right */}
        <div className="flex flex-1 min-h-0">
          <DockPanel side="left" title="Outline" defaultOpen={false}>
            <ul className="space-y-1 text-sm">
              {widgets.map((w) => (
                <li key={w.id} className="flex items-center justify-between rounded px-2 py-1 hover:bg-muted/50">
                  <span className="truncate">{w.title}</span>
                  <span className="text-[10px] uppercase text-muted-foreground">{w.type}</span>
                </li>
              ))}
            </ul>
          </DockPanel>

          <div className="min-w-0 flex-1 overflow-auto p-4">
            <Tabs defaultValue="grid" className="w-full">
              <TabsList>
                <TabsTrigger value="grid" className="gap-1.5"><Grid3x3 className="h-4 w-4" />Grid</TabsTrigger>
                <TabsTrigger value="split" className="gap-1.5"><Columns2 className="h-4 w-4" />Split screen</TabsTrigger>
              </TabsList>

              <TabsContent value="grid" className="mt-3">
                <DashboardGrid
                  widgets={widgets}
                  layout={layout}
                  editing={editing}
                  onChange={setLayout}
                  onRemove={removeWidget}
                />
              </TabsContent>

              <TabsContent value="split" className="mt-3">
                <SplitScreen
                  left={
                    widgets[0] ? (
                      <div className="h-[460px]"><Widget config={widgets[0]} /></div>
                    ) : (
                      <div className="grid h-full place-items-center text-sm text-muted-foreground">No widget</div>
                    )
                  }
                  right={
                    widgets[1] ? (
                      <div className="h-[460px]"><Widget config={widgets[1]} /></div>
                    ) : (
                      <div className="grid h-full place-items-center text-sm text-muted-foreground">No widget</div>
                    )
                  }
                />
              </TabsContent>
            </Tabs>
          </div>

          <DockPanel side="right" title="Inspector">
            <div className="space-y-3 text-sm">
              <div>
                <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Mode</div>
                <Badge>{editing ? "Editing" : "Preview"}</Badge>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Quick actions</div>
                <div className="flex flex-col gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="justify-start gap-1.5"
                    onClick={() => setFloating(widgets[0] ?? null)}
                    disabled={!widgets[0]}
                  >
                    <PanelRightOpen className="h-4 w-4" /> Pop out widget
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Tip</div>
                <p className="text-xs text-muted-foreground">
                  In edit mode, drag the card header to move and pull the bottom-right corner to resize.
                </p>
              </div>
            </div>
          </DockPanel>
        </div>

        {/* Floating widget overlay */}
        {floating && (
          <FloatingWidget title={floating.title} onClose={() => setFloating(null)}>
            <div className="h-[260px]">
              <Widget config={floating} />
            </div>
          </FloatingWidget>
        )}
      </div>
    </AppShell>
  );
}
