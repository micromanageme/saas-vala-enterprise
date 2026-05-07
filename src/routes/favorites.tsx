import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Favorites — SaaS Vala" }, { name: "description", content: "Pinned items" }] }),
  component: Page,
});

const kpis = [
  { label: "Pinned", value: "24", delta: "+2", up: true },
  { label: "Records", value: "18", delta: "—", up: true },
  { label: "Reports", value: "6", delta: "—", up: true },
  { label: "Views", value: "12", delta: "+1", up: true }
];
const columns = [{ key: "name", label: "Name" }, { key: "type", label: "Type" }, { key: "module", label: "Module" }, { key: "updated", label: "Updated" }];
const rows = [
  {
    "name": "VIP Customers",
    "type": "View",
    "module": "CRM",
    "updated": "1d ago"
  },
  {
    "name": "P&L Q2",
    "type": "Report",
    "module": "Accounting",
    "updated": "2d ago"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Favorites" subtitle="Pinned items" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
