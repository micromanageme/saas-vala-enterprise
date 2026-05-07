import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — SaaS Vala" }, { name: "description", content: "Top performers" }] }),
  component: Page,
});

const kpis = [
  { label: "#1 Sales", value: "$184K", delta: "+12%", up: true },
  { label: "#1 Region", value: "EU-West", delta: "—", up: true },
  { label: "Top CSAT", value: "4.9", delta: "—", up: true },
  { label: "Top Streak", value: "18d", delta: "—", up: true }
];
const columns = [{ key: "rank", label: "Rank" }, { key: "name", label: "Name" }, { key: "metric", label: "Metric" }, { key: "value", label: "Value" }];
const rows = [
  {
    "rank": 1,
    "name": "A. Khan",
    "metric": "Sales",
    "value": "$184,000"
  },
  {
    "rank": 2,
    "name": "M. Patel",
    "metric": "Sales",
    "value": "$148,000"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Leaderboard" subtitle="Top performers" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
