import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/mlm")({
  head: () => ({ meta: [{ title: "MLM Tree — SaaS Vala" }, { name: "description", content: "Referral & downline tree" }] }),
  component: Page,
});

const kpis = [
  { label: "Members", value: "12,420", delta: "+184", up: true },
  { label: "Levels", value: "7", delta: "—", up: true },
  { label: "Payouts", value: "$184K", delta: "+9%", up: true },
  { label: "Active", value: "82%", delta: "+1%", up: true }
];
const columns = [{ key: "name", label: "Member" }, { key: "level", label: "Level" }, { key: "downline", label: "Downline" }, { key: "earnings", label: "Earnings" }];
const rows = [
  {
    "name": "A. Khan",
    "level": 1,
    "downline": 42,
    "earnings": "$8,400"
  },
  {
    "name": "M. Patel",
    "level": 2,
    "downline": 18,
    "earnings": "$3,200"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="MLM Tree" subtitle="Referral & downline tree" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
