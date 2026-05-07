import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({ meta: [{ title: "Subscriptions — SaaS Vala" }, { name: "description", content: "Recurring billing & MRR" }] }),
  component: Page,
});

const kpis = [
  { label: "MRR", value: "$182,400", delta: "+6.4%", up: true },
  { label: "Active Subs", value: "3,128", delta: "+92", up: true },
  { label: "Churn", value: "1.8%", delta: "-0.3%", up: true },
  { label: "LTV", value: "$2,840", delta: "+4%", up: true }
];
const columns = [{ key: "plan", label: "Plan" }, { key: "customers", label: "Customers" }, { key: "mrr", label: "MRR" }, { key: "status", label: "Status" }];
const rows = [
  {
    "plan": "Pro",
    "customers": 1820,
    "mrr": "$91,000",
    "status": "Active"
  },
  {
    "plan": "Enterprise",
    "customers": 312,
    "mrr": "$78,000",
    "status": "Active"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Subscriptions" subtitle="Recurring billing & MRR" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
