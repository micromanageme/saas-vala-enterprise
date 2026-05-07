import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Documents — SaaS Vala" }, { name: "description", content: "Files, media & e-sign" }] }),
  component: Page,
});

const kpis = [
  { label: "Files", value: "12,420", delta: "+184", up: true },
  { label: "Storage", value: "248 GB", delta: "+8 GB", up: true },
  { label: "Signed", value: "842", delta: "+18%", up: true },
  { label: "Pending", value: "24", delta: "—", up: true }
];
const columns = [{ key: "name", label: "File" }, { key: "owner", label: "Owner" }, { key: "size", label: "Size" }, { key: "updated", label: "Updated" }];
const rows = [
  {
    "name": "Contract-Acme.pdf",
    "owner": "Legal",
    "size": "2.4 MB",
    "updated": "today"
  },
  {
    "name": "Logo.svg",
    "owner": "Brand",
    "size": "48 KB",
    "updated": "2d"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Documents" subtitle="Files, media & e-sign" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
