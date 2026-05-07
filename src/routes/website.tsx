import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/website")({
  head: () => ({ meta: [{ title: "Website Builder — SaaS Vala" }, { name: "description", content: "Drag-drop pages, SEO & banners" }] }),
  component: Page,
});

const kpis = [
  { label: "Pages", value: "42", delta: "+4", up: true },
  { label: "Visits (24h)", value: "24,820", delta: "+12%", up: true },
  { label: "SEO Score", value: "92", delta: "+3", up: true },
  { label: "Banners", value: "12", delta: "—", up: true }
];
const columns = [{ key: "page", label: "Page" }, { key: "visits", label: "Visits" }, { key: "conv", label: "Conversion" }, { key: "status", label: "Status" }];
const rows = [
  {
    "page": "/home",
    "visits": 18420,
    "conv": "4.8%",
    "status": "Live"
  },
  {
    "page": "/pricing",
    "visits": 6240,
    "conv": "8.2%",
    "status": "Live"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Website Builder" subtitle="Drag-drop pages, SEO & banners" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
