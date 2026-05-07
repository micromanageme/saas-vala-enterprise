import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/branches")({
  head: () => ({ meta: [{ title: "Multi Branch — SaaS Vala" }, { name: "description", content: "Branches & regions" }] }),
  component: Page,
});

const kpis = [
  { label: "Branches", value: "42", delta: "+3", up: true },
  { label: "Regions", value: "8", delta: "—", up: true },
  { label: "Top Branch Rev", value: "$248K", delta: "+12%", up: true },
  { label: "Active Staff", value: "1,240", delta: "+22", up: true }
];
const columns = [{ key: "code", label: "Code" }, { key: "name", label: "Branch" }, { key: "region", label: "Region" }, { key: "manager", label: "Manager" }];
const rows = [
  {
    "code": "BR-001",
    "name": "Mumbai HQ",
    "region": "West",
    "manager": "A. Khan"
  },
  {
    "code": "BR-002",
    "name": "Delhi NCR",
    "region": "North",
    "manager": "R. Singh"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Multi Branch" subtitle="Branches & regions" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
