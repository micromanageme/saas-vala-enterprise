import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/heatmaps")({
  head: () => ({ meta: [{ title: "Heatmaps — SaaS Vala" }, { name: "description", content: "Density visualizations" }] }),
  component: Page,
});

const kpis = [
  { label: "Datasets", value: "24", delta: "+2", up: true },
  { label: "Cells", value: "12,480", delta: "—", up: true },
  { label: "Peak", value: "8,420", delta: "—", up: true },
  { label: "Avg", value: "420", delta: "—", up: true }
];
const columns = [{ key: "region", label: "Region" }, { key: "hits", label: "Hits" }, { key: "avg", label: "Avg" }, { key: "peak", label: "Peak" }];
const rows = [
  {
    "region": "EU-West",
    "hits": 48200,
    "avg": 420,
    "peak": 8420
  },
  {
    "region": "US-East",
    "hits": 62000,
    "avg": 580,
    "peak": 9120
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Heatmaps" subtitle="Density visualizations" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
