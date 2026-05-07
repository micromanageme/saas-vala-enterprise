import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/hrm")({
  head: () => ({ meta: [{ title: "HRM — SaaS Vala" }, { name: "description", content: "Employees, payroll & leave" }] }),
  component: Page,
});

const kpis = [
  { label: "Headcount", value: "842", delta: "+12", up: true },
  { label: "Open Roles", value: "24", delta: "+3", up: true },
  { label: "Payroll", value: "$1.84M", delta: "+2%", up: true },
  { label: "Attrition", value: "3.2%", delta: "-0.4%", up: true }
];
const columns = [{ key: "emp", label: "Employee" }, { key: "role", label: "Role" }, { key: "dept", label: "Department" }, { key: "status", label: "Status" }];
const rows = [
  {
    "emp": "A. Khan",
    "role": "Sales Lead",
    "dept": "Sales",
    "status": "Active"
  },
  {
    "emp": "M. Patel",
    "role": "Engineer",
    "dept": "R&D",
    "status": "Active"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="HRM" subtitle="Employees, payroll & leave" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
