import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/org-chart")({
  head: () => ({ meta: [{ title: "Org Chart — SaaS Vala" }, { name: "description", content: "Hierarchy view" }] }),
  component: Page,
});

const kpis = [
  { label: "People", value: "842", delta: "+12", up: true },
  { label: "Departments", value: "12", delta: "—", up: true },
  { label: "Managers", value: "64", delta: "+2", up: true },
  { label: "Spans", value: "7.2", delta: "—", up: true }
];
const columns = [{ key: "name", label: "Person" }, { key: "role", label: "Role" }, { key: "reports", label: "Reports" }, { key: "dept", label: "Dept" }];
const rows = [
  {
    "name": "CEO",
    "role": "Chief Executive",
    "reports": 8,
    "dept": "Exec"
  },
  {
    "name": "CTO",
    "role": "Chief Technology",
    "reports": 6,
    "dept": "Eng"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Org Chart" subtitle="Hierarchy view" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
