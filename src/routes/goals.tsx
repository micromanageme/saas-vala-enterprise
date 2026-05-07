import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [{ title: "Goals & OKRs — SaaS Vala" }, { name: "description", content: "Targets and progress" }] }),
  component: Page,
});

const kpis = [
  { label: "Active", value: "24", delta: "+3", up: true },
  { label: "On Track", value: "18", delta: "—", up: true },
  { label: "At Risk", value: "4", delta: "-1", up: true },
  { label: "Done", value: "12", delta: "+2", up: true }
];
const columns = [{ key: "name", label: "Goal" }, { key: "owner", label: "Owner" }, { key: "progress", label: "Progress" }, { key: "status", label: "Status" }];
const rows = [
  {
    "name": "Grow MRR 20%",
    "owner": "CEO",
    "progress": "62%",
    "status": "On Track"
  },
  {
    "name": "Reduce Churn",
    "owner": "CS",
    "progress": "48%",
    "status": "At Risk"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Goals & OKRs" subtitle="Targets and progress" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
