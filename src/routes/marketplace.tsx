import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace — SaaS Vala" }, { name: "description", content: "Multi-vendor marketplace" }] }),
  component: Page,
});

const kpis = [
  { label: "Vendors", value: "428", delta: "+12", up: true },
  { label: "Listings", value: "12,498", delta: "+340", up: true },
  { label: "GMV", value: "$1.84M", delta: "+19%", up: true },
  { label: "Disputes", value: "3", delta: "-2", up: true }
];
const columns = [{ key: "vendor", label: "Vendor" }, { key: "listings", label: "Listings" }, { key: "gmv", label: "GMV" }, { key: "rating", label: "Rating" }];
const rows = [
  {
    "vendor": "NorthGoods",
    "listings": 142,
    "gmv": "$48,200",
    "rating": "4.8"
  },
  {
    "vendor": "BlueWave",
    "listings": 88,
    "gmv": "$31,400",
    "rating": "4.6"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Marketplace" subtitle="Multi-vendor marketplace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
