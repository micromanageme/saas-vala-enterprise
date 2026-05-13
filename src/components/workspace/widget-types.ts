export type WidgetType =
  | "kpi"
  | "chart-line"
  | "chart-bar"
  | "chart-area"
  | "activity"
  | "tasks"
  | "notes"
  | "clock"
  | "ai-insights"
  | "table";

export type WidgetConfig = {
  id: string;
  type: WidgetType;
  title: string;
  meta?: Record<string, any>;
};

export type DashboardLayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
};

export type WorkspaceTemplate = {
  id: string;
  name: string;
  description: string;
  widgets: WidgetConfig[];
  layout: DashboardLayoutItem[];
};

export const WIDGET_CATALOG: { type: WidgetType; title: string; description: string; defaultSize: { w: number; h: number } }[] = [
  { type: "kpi", title: "KPI Tile", description: "Single metric with delta", defaultSize: { w: 3, h: 2 } },
  { type: "chart-line", title: "Line Chart", description: "Trend over time", defaultSize: { w: 6, h: 4 } },
  { type: "chart-bar", title: "Bar Chart", description: "Category comparison", defaultSize: { w: 6, h: 4 } },
  { type: "chart-area", title: "Area Chart", description: "Cumulative trend", defaultSize: { w: 6, h: 4 } },
  { type: "activity", title: "Activity Feed", description: "Recent events", defaultSize: { w: 4, h: 6 } },
  { type: "tasks", title: "Task List", description: "Action items", defaultSize: { w: 4, h: 5 } },
  { type: "notes", title: "Notes", description: "Free-form notepad", defaultSize: { w: 4, h: 4 } },
  { type: "clock", title: "World Clock", description: "Multi-zone time", defaultSize: { w: 3, h: 3 } },
  { type: "ai-insights", title: "AI Insights", description: "Generated highlights", defaultSize: { w: 6, h: 4 } },
  { type: "table", title: "Data Table", description: "Compact rows", defaultSize: { w: 8, h: 5 } },
];

export const TEMPLATES: WorkspaceTemplate[] = [
  {
    id: "executive",
    name: "Executive Overview",
    description: "C-suite KPIs, trend charts, AI insights",
    widgets: [
      { id: "k1", type: "kpi", title: "Revenue", meta: { value: "$2.4M", delta: "+12%", up: true } },
      { id: "k2", type: "kpi", title: "Active Users", meta: { value: "48.2k", delta: "+5%", up: true } },
      { id: "k3", type: "kpi", title: "Churn", meta: { value: "1.8%", delta: "-0.3%", up: true } },
      { id: "k4", type: "kpi", title: "NPS", meta: { value: "72", delta: "+4", up: true } },
      { id: "c1", type: "chart-area", title: "Revenue Trend" },
      { id: "ai", type: "ai-insights", title: "AI Insights" },
    ],
    layout: [
      { i: "k1", x: 0, y: 0, w: 3, h: 2 },
      { i: "k2", x: 3, y: 0, w: 3, h: 2 },
      { i: "k3", x: 6, y: 0, w: 3, h: 2 },
      { i: "k4", x: 9, y: 0, w: 3, h: 2 },
      { i: "c1", x: 0, y: 2, w: 6, h: 4 },
      { i: "ai", x: 6, y: 2, w: 6, h: 4 },
    ],
  },
  {
    id: "ops",
    name: "Operations Control",
    description: "Real-time activity, tasks, alerts",
    widgets: [
      { id: "act", type: "activity", title: "Live Activity" },
      { id: "tsk", type: "tasks", title: "Open Tasks" },
      { id: "ch", type: "chart-line", title: "Throughput" },
      { id: "kp", type: "kpi", title: "Uptime", meta: { value: "99.98%", delta: "+0.01%", up: true } },
    ],
    layout: [
      { i: "kp", x: 0, y: 0, w: 3, h: 2 },
      { i: "ch", x: 3, y: 0, w: 9, h: 4 },
      { i: "act", x: 0, y: 4, w: 6, h: 5 },
      { i: "tsk", x: 6, y: 4, w: 6, h: 5 },
    ],
  },
  {
    id: "analyst",
    name: "Analyst Workbench",
    description: "Charts-heavy, comparison & forecast",
    widgets: [
      { id: "b1", type: "chart-bar", title: "By Segment" },
      { id: "l1", type: "chart-line", title: "Forecast" },
      { id: "a1", type: "chart-area", title: "Cumulative" },
      { id: "n1", type: "notes", title: "Hypotheses" },
    ],
    layout: [
      { i: "b1", x: 0, y: 0, w: 6, h: 4 },
      { i: "l1", x: 6, y: 0, w: 6, h: 4 },
      { i: "a1", x: 0, y: 4, w: 8, h: 4 },
      { i: "n1", x: 8, y: 4, w: 4, h: 4 },
    ],
  },
];
