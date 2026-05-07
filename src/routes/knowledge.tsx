import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge Base — SaaS Vala" }, { name: "description", content: "Articles, FAQ & guides" }] }),
  component: Page,
});

const kpis = [
  { label: "Articles", value: "248", delta: "+12", up: true },
  { label: "Views (24h)", value: "12,420", delta: "+9%", up: true },
  { label: "Helpful", value: "92%", delta: "+1%", up: true },
  { label: "Drafts", value: "8", delta: "—", up: true }
];
const columns = [{ key: "title", label: "Article" }, { key: "category", label: "Category" }, { key: "views", label: "Views" }, { key: "updated", label: "Updated" }];
const rows = [
  {
    "title": "Getting started",
    "category": "Onboarding",
    "views": 8420,
    "updated": "1w"
  },
  {
    "title": "Issue invoice",
    "category": "Accounting",
    "views": 3120,
    "updated": "3d"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Knowledge Base" subtitle="Articles, FAQ & guides" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
