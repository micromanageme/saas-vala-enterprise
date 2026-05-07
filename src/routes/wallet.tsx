import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "Wallet — SaaS Vala" }, { name: "description", content: "Balance, payouts & commissions" }] }),
  component: Page,
});

const kpis = [
  { label: "Balance", value: "$24,820", delta: "+$1.2K", up: true },
  { label: "Pending", value: "$3,420", delta: "—", up: true },
  { label: "Lifetime", value: "$184K", delta: "+9%", up: true },
  { label: "Currency", value: "USD", delta: "—", up: true }
];
const columns = [{ key: "ts", label: "Time" }, { key: "type", label: "Type" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }];
const rows = [
  {
    "ts": "today",
    "type": "Commission",
    "amount": "+$1,240",
    "status": "Cleared"
  },
  {
    "ts": "1d",
    "type": "Payout",
    "amount": "-$8,400",
    "status": "Sent"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Wallet" subtitle="Balance, payouts & commissions" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
