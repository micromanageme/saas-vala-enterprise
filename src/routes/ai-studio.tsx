import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/ai-studio")({
  head: () => ({ meta: [{ title: "AI Studio — SaaS Vala" }, { name: "description", content: "AI assistants & flows" }] }),
  component: Page,
});

const kpis = [
  { label: "Assistants", value: "12", delta: "+2", up: true },
  { label: "Flows", value: "42", delta: "+4", up: true },
  { label: "Runs (24h)", value: "8,420", delta: "+18%", up: true },
  { label: "Avg Latency", value: "420ms", delta: "-40ms", up: true }
];
const columns = [{ key: "name", label: "Name" }, { key: "type", label: "Type" }, { key: "runs", label: "Runs" }, { key: "status", label: "Status" }];
const rows = [
  {
    "name": "Sales Copilot",
    "type": "Assistant",
    "runs": 1240,
    "status": "Active"
  },
  {
    "name": "Invoice Extract",
    "type": "Flow",
    "runs": 842,
    "status": "Active"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="AI Studio" subtitle="AI assistants & flows" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
