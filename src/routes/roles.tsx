import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/roles")({
  head: () => ({ meta: [{ title: "Roles & Permissions — SaaS Vala" }, { name: "description", content: "Permission matrix & role builder" }] }),
  component: Page,
});

const kpis = [
  { label: "Roles", value: "12", delta: "—", up: true },
  { label: "Permissions", value: "248", delta: "+4", up: true },
  { label: "Users", value: "842", delta: "+12", up: true },
  { label: "Admins", value: "6", delta: "—", up: true }
];
const columns = [{ key: "name", label: "Role" }, { key: "users", label: "Users" }, { key: "perms", label: "Permissions" }, { key: "updated", label: "Updated" }];
const rows = [
  {
    "name": "Admin",
    "users": 6,
    "perms": 248,
    "updated": "today"
  },
  {
    "name": "Sales",
    "users": 148,
    "perms": 42,
    "updated": "1w"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Roles & Permissions" subtitle="Permission matrix & role builder" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
