import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — SaaS Vala" }, { name: "description", content: "Enterprise reports & exports" }] }),
  component: Page,
});

const kpis = [
  { label: "Saved", value: "148", delta: "+6", up: true },
  { label: "Scheduled", value: "42", delta: "+2", up: true },
  { label: "Last Run", value: "OK", delta: "—", up: true },
  { label: "Recipients", value: "312", delta: "+8", up: true }
];
const columns = [{ key: "name", label: "Report" }, { key: "module", label: "Module" }, { key: "schedule", label: "Schedule" }, { key: "owner", label: "Owner" }];
const rows = [
  {
    "name": "P&L Monthly",
    "module": "Accounting",
    "schedule": "Monthly",
    "owner": "CFO"
  },
  {
    "name": "Sales Pipeline",
    "module": "CRM",
    "schedule": "Weekly",
    "owner": "VP Sales"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Reports" subtitle="Enterprise reports & exports" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
