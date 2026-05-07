import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/pos")({
  head: () => ({ meta: [{ title: "POS — SaaS Vala" }, { name: "description", content: "Point of sale terminals" }] }),
  component: Page,
});

const kpis = [
  { label: "Today Sales", value: "$8,420", delta: "+22%", up: true },
  { label: "Tickets", value: "312", delta: "+18%", up: true },
  { label: "Avg Basket", value: "$27", delta: "+1.4%", up: true },
  { label: "Open Sessions", value: "4", delta: "—", up: true }
];
const columns = [{ key: "ticket", label: "Ticket" }, { key: "cashier", label: "Cashier" }, { key: "total", label: "Total" }, { key: "time", label: "Time" }];
const rows = [
  {
    "ticket": "POS-7781",
    "cashier": "L. Verma",
    "total": "$42.10",
    "time": "12:04"
  },
  {
    "ticket": "POS-7782",
    "cashier": "L. Verma",
    "total": "$18.90",
    "time": "12:09"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="POS" subtitle="Point of sale terminals" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
