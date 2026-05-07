import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — SaaS Vala" }, { name: "description", content: "Full system configuration" }] }),
  component: Page,
});

const kpis = [
  { label: "Modules", value: "25", delta: "—", up: true },
  { label: "Users", value: "842", delta: "+12", up: true },
  { label: "Roles", value: "12", delta: "—", up: true },
  { label: "Integrations", value: "24", delta: "+2", up: true }
];
const columns = [{ key: "name", label: "Setting" }, { key: "scope", label: "Scope" }, { key: "value", label: "Value" }, { key: "updated", label: "Updated" }];
const rows = [
  {
    "name": "Default Currency",
    "scope": "Global",
    "value": "USD",
    "updated": "2026-04-01"
  },
  {
    "name": "Fiscal Year Start",
    "scope": "Global",
    "value": "Jan 1",
    "updated": "2026-01-01"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Settings" subtitle="Full system configuration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
