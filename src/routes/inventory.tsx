import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventory — SaaS Vala" }, { name: "description", content: "Stock, warehouses & moves" }] }),
  component: Page,
});

const kpis = [
  { label: "SKUs", value: "8,420", delta: "+12", up: true },
  { label: "On Hand", value: "$2.1M", delta: "+3%", up: true },
  { label: "Pending Moves", value: "42", delta: "-5", up: true },
  { label: "Stockouts", value: "3", delta: "-1", up: true }
];
const columns = [{ key: "sku", label: "SKU" }, { key: "name", label: "Product" }, { key: "qty", label: "On Hand" }, { key: "wh", label: "Warehouse" }];
const rows = [
  {
    "sku": "SKU-001",
    "name": "Widget A",
    "qty": 1240,
    "wh": "WH-Main"
  },
  {
    "sku": "SKU-002",
    "name": "Gadget B",
    "qty": 312,
    "wh": "WH-East"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Inventory" subtitle="Stock, warehouses & moves" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
