import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/accounting")({
  head: () => ({ meta: [{ title: "Accounting — SaaS Vala" }, { name: "description", content: "Ledger, taxes & reports" }] }),
  component: Page,
});

const kpis = [
  { label: "Cash", value: "$1.42M", delta: "+8%", up: true },
  { label: "AR", value: "$348K", delta: "-2%", up: true },
  { label: "AP", value: "$212K", delta: "+1%", up: true },
  { label: "Net Income", value: "$184K", delta: "+12%", up: true }
];
const columns = [{ key: "journal", label: "Journal" }, { key: "ref", label: "Ref" }, { key: "debit", label: "Debit" }, { key: "credit", label: "Credit" }];
const rows = [
  {
    "journal": "Sales",
    "ref": "INV-2041",
    "debit": "$0",
    "credit": "$24,000"
  },
  {
    "journal": "Bank",
    "ref": "BNK-882",
    "debit": "$24,000",
    "credit": "$0"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Accounting" subtitle="Ledger, taxes & reports" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
