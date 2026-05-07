import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/franchises")({
  head: () => ({ meta: [{ title: "Franchise System — SaaS Vala" }, { name: "description", content: "Franchisee network" }] }),
  component: Page,
});

const kpis = [
  { label: "Franchises", value: "64", delta: "+4", up: true },
  { label: "Locations", value: "148", delta: "+9", up: true },
  { label: "Royalties", value: "$248K", delta: "+6%", up: true },
  { label: "Open Tickets", value: "12", delta: "-3", up: true }
];
const columns = [{ key: "name", label: "Franchisee" }, { key: "region", label: "Region" }, { key: "locations", label: "Locations" }, { key: "status", label: "Status" }];
const rows = [
  {
    "name": "Vala East",
    "region": "East",
    "locations": 24,
    "status": "Active"
  },
  {
    "name": "Vala South",
    "region": "South",
    "locations": 18,
    "status": "Active"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Franchise System" subtitle="Franchisee network" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
