import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/live")({
  head: () => ({ meta: [{ title: "Live Analytics — SaaS Vala" }, { name: "description", content: "Real-time metrics" }] }),
  component: Page,
});

const kpis = [
  { label: "Active Now", value: "1,284", delta: "+42", up: true },
  { label: "Events/s", value: "428", delta: "+18", up: true },
  { label: "Errors", value: "0.04%", delta: "-0.01%", up: true },
  { label: "Latency", value: "118ms", delta: "-22ms", up: true }
];
const columns = [{ key: "metric", label: "Metric" }, { key: "value", label: "Value" }, { key: "change", label: "Change" }, { key: "ts", label: "Time" }];
const rows = [
  {
    "metric": "Logins",
    "value": 84,
    "change": "+12",
    "ts": "now"
  },
  {
    "metric": "Orders",
    "value": 18,
    "change": "+3",
    "ts": "now"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Live Analytics" subtitle="Real-time metrics" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
