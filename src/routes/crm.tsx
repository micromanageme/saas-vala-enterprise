import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/crm")({
  head: () => ({ meta: [{ title: "CRM — SaaS Vala" }, { name: "description", content: "Leads, opportunities & customer pipeline" }] }),
  component: Page,
});

const kpis = [
  { label: "Open Leads", value: "312", delta: "+18%", up: true },
  { label: "Won Deals", value: "$842K", delta: "+9%", up: true },
  { label: "Win Rate", value: "34%", delta: "+2%", up: true },
  { label: "Avg Cycle", value: "21d", delta: "-3d", up: true }
];
const columns = [{ key: "name", label: "Customer" }, { key: "stage", label: "Stage" }, { key: "value", label: "Value" }, { key: "owner", label: "Owner" }];
const rows = [
  {
    "name": "Acme Corp",
    "stage": "Qualified",
    "value": "$24,000",
    "owner": "A. Khan"
  },
  {
    "name": "Globex",
    "stage": "Proposal",
    "value": "$58,400",
    "owner": "M. Patel"
  },
  {
    "name": "Initech",
    "stage": "Negotiation",
    "value": "$112,000",
    "owner": "R. Singh"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="CRM" subtitle="Leads, opportunities & customer pipeline" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
