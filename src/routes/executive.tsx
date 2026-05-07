import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/executive")({
  head: () => ({ meta: [{ title: "Executive Dashboard — SaaS Vala" }, { name: "description", content: "C-suite overview" }] }),
  component: Page,
});

const kpis = [
  { label: "Revenue", value: "$4.28M", delta: "+14%", up: true },
  { label: "EBITDA", value: "$1.12M", delta: "+9%", up: true },
  { label: "Cash", value: "$2.4M", delta: "+6%", up: true },
  { label: "NPS", value: "62", delta: "+4", up: true }
];
const columns = [{ key: "kpi", label: "KPI" }, { key: "target", label: "Target" }, { key: "actual", label: "Actual" }, { key: "status", label: "Status" }];
const rows = [
  {
    "kpi": "Q2 Revenue",
    "target": "$4M",
    "actual": "$4.28M",
    "status": "On Track"
  },
  {
    "kpi": "Gross Margin",
    "target": "42%",
    "actual": "44%",
    "status": "Above"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Executive Dashboard" subtitle="C-suite overview" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
