import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — SaaS Vala" }, { name: "description", content: "Your profile, preferences & security" }] }),
  component: Page,
});

const kpis = [
  { label: "Name", value: "SaaS Vala", delta: "—", up: true },
  { label: "Role", value: "Admin", delta: "—", up: true },
  { label: "MFA", value: "Enabled", delta: "—", up: true },
  { label: "Sessions", value: "3", delta: "—", up: true }
];
const columns = [{ key: "key", label: "Setting" }, { key: "value", label: "Value" }, { key: "scope", label: "Scope" }, { key: "updated", label: "Updated" }];
const rows = [
  {
    "key": "Display name",
    "value": "Admin User",
    "scope": "Personal",
    "updated": "today"
  },
  {
    "key": "Timezone",
    "value": "UTC+5:30",
    "scope": "Personal",
    "updated": "1w"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Profile" subtitle="Your profile, preferences & security" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
