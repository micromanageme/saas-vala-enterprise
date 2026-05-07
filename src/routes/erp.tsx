import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/erp")({
  head: () => ({ meta: [{ title: "Sales / ERP — SaaS Vala" }, { name: "description", content: "Quotations, orders & invoicing" }] }),
  component: Page,
});

const kpis = [
  { label: "Quotations", value: "148", delta: "+11%", up: true },
  { label: "Sales Orders", value: "97", delta: "+6%", up: true },
  { label: "Invoiced", value: "$612K", delta: "+14%", up: true },
  { label: "Backorders", value: "12", delta: "-3", up: true }
];
const columns = [{ key: "so", label: "SO #" }, { key: "customer", label: "Customer" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }];
const rows = [
  {
    "so": "SO-1042",
    "customer": "Acme Corp",
    "amount": "$24,000",
    "status": "Confirmed"
  },
  {
    "so": "SO-1043",
    "customer": "Vertex Ltd",
    "amount": "$8,250",
    "status": "Draft"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Sales / ERP" subtitle="Quotations, orders & invoicing" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
