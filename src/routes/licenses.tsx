import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/licenses")({
  head: () => ({ meta: [{ title: "License System — SaaS Vala" }, { name: "description", content: "Issue & manage product licenses" }] }),
  component: Page,
});

const kpis = [
  { label: "Active", value: "12,420", delta: "+184", up: true },
  { label: "Trials", value: "842", delta: "+24", up: true },
  { label: "Revoked", value: "12", delta: "—", up: true },
  { label: "Expiring", value: "98", delta: "—", up: true }
];
const columns = [{ key: "key", label: "License Key" }, { key: "product", label: "Product" }, { key: "customer", label: "Customer" }, { key: "status", label: "Status" }];
const rows = [
  {
    "key": "SV-XXXX-AAAA",
    "product": "Vala Pro",
    "customer": "Acme Corp",
    "status": "Active"
  },
  {
    "key": "SV-XXXX-BBBB",
    "product": "Vala Lite",
    "customer": "Globex",
    "status": "Trial"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="License System" subtitle="Issue & manage product licenses" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
