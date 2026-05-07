import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/automation")({
  head: () => ({ meta: [{ title: "Automation — SaaS Vala" }, { name: "description", content: "Triggers & workflows" }] }),
  component: Page,
});

const kpis = [
  { label: "Flows", value: "42", delta: "+4", up: true },
  { label: "Runs (24h)", value: "12,420", delta: "+8%", up: true },
  { label: "Errors", value: "0.2%", delta: "-0.1%", up: true },
  { label: "Saved Hrs", value: "148", delta: "+12", up: true }
];
const columns = [{ key: "name", label: "Flow" }, { key: "trigger", label: "Trigger" }, { key: "runs", label: "Runs" }, { key: "status", label: "Status" }];
const rows = [
  {
    "name": "New Order → Invoice",
    "trigger": "order.created",
    "runs": 842,
    "status": "Active"
  },
  {
    "name": "Lead → Email",
    "trigger": "lead.created",
    "runs": 312,
    "status": "Active"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Automation" subtitle="Triggers & workflows" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
