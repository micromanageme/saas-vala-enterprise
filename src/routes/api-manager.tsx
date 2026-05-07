import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/api-manager")({
  head: () => ({ meta: [{ title: "API Manager — SaaS Vala" }, { name: "description", content: "Keys, webhooks & docs" }] }),
  component: Page,
});

const kpis = [
  { label: "API Keys", value: "42", delta: "+3", up: true },
  { label: "Webhooks", value: "28", delta: "+2", up: true },
  { label: "Calls (24h)", value: "1.2M", delta: "+9%", up: true },
  { label: "Errors", value: "0.04%", delta: "-0.02%", up: true }
];
const columns = [{ key: "name", label: "Name" }, { key: "scope", label: "Scope" }, { key: "created", label: "Created" }, { key: "status", label: "Status" }];
const rows = [
  {
    "name": "prod-key-01",
    "scope": "read,write",
    "created": "2026-04-01",
    "status": "Active"
  },
  {
    "name": "webhook-01",
    "scope": "orders.*",
    "created": "2026-04-12",
    "status": "Active"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="API Manager" subtitle="Keys, webhooks & docs" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
