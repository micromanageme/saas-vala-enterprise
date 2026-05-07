import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/invoices")({
  head: () => ({ meta: [{ title: "Invoices — SaaS Vala" }, { name: "description", content: "Invoice builder & tracking" }] }),
  component: Page,
});

const kpis = [
  { label: "Open", value: "148", delta: "+8", up: true },
  { label: "Overdue", value: "12", delta: "-2", up: true },
  { label: "Paid (MTD)", value: "$612K", delta: "+14%", up: true },
  { label: "Avg DSO", value: "24d", delta: "-3d", up: true }
];
const columns = [{ key: "inv", label: "Invoice" }, { key: "customer", label: "Customer" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }];
const rows = [
  {
    "inv": "INV-2041",
    "customer": "Acme Corp",
    "amount": "$24,000",
    "status": "Sent"
  },
  {
    "inv": "INV-2042",
    "customer": "Globex",
    "amount": "$8,250",
    "status": "Paid"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Invoices" subtitle="Invoice builder & tracking" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
