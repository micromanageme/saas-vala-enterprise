import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/manufacturing")({
  head: () => ({ meta: [{ title: "Manufacturing — SaaS Vala" }, { name: "description", content: "BoM, MO & work centers" }] }),
  component: Page,
});

const kpis = [
  { label: "Open MOs", value: "42", delta: "+4", up: true },
  { label: "Completed", value: "188", delta: "+22", up: true },
  { label: "Throughput", value: "97%", delta: "+1%", up: true },
  { label: "Scrap", value: "0.8%", delta: "-0.2%", up: true }
];
const columns = [{ key: "mo", label: "MO #" }, { key: "product", label: "Product" }, { key: "qty", label: "Qty" }, { key: "status", label: "Status" }];
const rows = [
  {
    "mo": "MO-3101",
    "product": "Widget A",
    "qty": 500,
    "status": "In Progress"
  },
  {
    "mo": "MO-3102",
    "product": "Gadget B",
    "qty": 200,
    "status": "Planned"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Manufacturing" subtitle="BoM, MO & work centers" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
