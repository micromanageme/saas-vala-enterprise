import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/resellers")({
  head: () => ({ meta: [{ title: "Reseller System — SaaS Vala" }, { name: "description", content: "Channel partners & commissions" }] }),
  component: Page,
});

const kpis = [
  { label: "Resellers", value: "148", delta: "+8", up: true },
  { label: "Tier-1", value: "22", delta: "+1", up: true },
  { label: "Sales", value: "$924K", delta: "+11%", up: true },
  { label: "Commission", value: "$92K", delta: "+11%", up: true }
];
const columns = [{ key: "name", label: "Reseller" }, { key: "tier", label: "Tier" }, { key: "sales", label: "Sales" }, { key: "commission", label: "Commission" }];
const rows = [
  {
    "name": "NorthPartners",
    "tier": "Gold",
    "sales": "$184,000",
    "commission": "$18,400"
  },
  {
    "name": "BluePeak",
    "tier": "Silver",
    "sales": "$92,000",
    "commission": "$6,400"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Reseller System" subtitle="Channel partners & commissions" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
