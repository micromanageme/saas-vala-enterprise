import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/theme")({
  head: () => ({ meta: [{ title: "Theme & Branding — SaaS Vala" }, { name: "description", content: "Logo, colors & layout" }] }),
  component: Page,
});

const kpis = [
  { label: "Theme", value: "Vala Dark", delta: "—", up: true },
  { label: "Accent", value: "Violet+Cyan", delta: "—", up: true },
  { label: "Logos", value: "3", delta: "—", up: true },
  { label: "Mode", value: "Dark", delta: "—", up: true }
];
const columns = [{ key: "key", label: "Token" }, { key: "value", label: "Value" }, { key: "scope", label: "Scope" }, { key: "updated", label: "Updated" }];
const rows = [
  {
    "key": "Primary",
    "value": "Violet 500",
    "scope": "Global",
    "updated": "today"
  },
  {
    "key": "Accent",
    "value": "Cyan 500",
    "scope": "Global",
    "updated": "today"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Theme & Branding" subtitle="Logo, colors & layout" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
