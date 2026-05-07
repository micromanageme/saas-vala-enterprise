import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — SaaS Vala" }, { name: "description", content: "Live cross-module charts" }] }),
  component: Page,
});

const kpis = [
  { label: "Pageviews", value: "842K", delta: "+12%", up: true },
  { label: "Sessions", value: "148K", delta: "+9%", up: true },
  { label: "Conv Rate", value: "4.8%", delta: "+0.4%", up: true },
  { label: "ARPU", value: "$42", delta: "+3%", up: true }
];
const columns = [{ key: "metric", label: "Metric" }, { key: "value", label: "Value" }, { key: "trend", label: "Trend" }, { key: "source", label: "Source" }];
const rows = [
  {
    "metric": "Signups",
    "value": 1240,
    "trend": "+18%",
    "source": "Web"
  },
  {
    "metric": "Demos",
    "value": 312,
    "trend": "+22%",
    "source": "Sales"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Analytics" subtitle="Live cross-module charts" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
