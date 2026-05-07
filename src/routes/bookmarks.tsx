import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({ meta: [{ title: "Bookmarks — SaaS Vala" }, { name: "description", content: "Saved views & shortcuts" }] }),
  component: Page,
});

const kpis = [
  { label: "Bookmarks", value: "42", delta: "+4", up: true },
  { label: "Shared", value: "18", delta: "—", up: true },
  { label: "Personal", value: "24", delta: "+4", up: true },
  { label: "Folders", value: "6", delta: "—", up: true }
];
const columns = [{ key: "name", label: "Bookmark" }, { key: "url", label: "Link" }, { key: "scope", label: "Scope" }, { key: "updated", label: "Updated" }];
const rows = [
  {
    "name": "Open Quotes",
    "url": "/erp",
    "scope": "Team",
    "updated": "today"
  },
  {
    "name": "Pipeline Q3",
    "url": "/crm",
    "scope": "Personal",
    "updated": "1w"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Bookmarks" subtitle="Saved views & shortcuts" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
