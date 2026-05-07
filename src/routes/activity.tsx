import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/activity")({
  head: () => ({ meta: [{ title: "Activity Timeline — SaaS Vala" }, { name: "description", content: "Recent activity across the suite" }] }),
  component: Page,
});

const kpis = [
  { label: "Today", value: "842", delta: "+18%", up: true },
  { label: "This Week", value: "12,420", delta: "+9%", up: true },
  { label: "Users", value: "148", delta: "+12", up: true },
  { label: "Modules", value: "24", delta: "—", up: true }
];
const columns = [{ key: "ts", label: "Time" }, { key: "user", label: "User" }, { key: "action", label: "Action" }, { key: "module", label: "Module" }];
const rows = [
  {
    "ts": "12:04",
    "user": "a.khan",
    "action": "Created SO-1042",
    "module": "ERP"
  },
  {
    "ts": "12:09",
    "user": "r.singh",
    "action": "Updated CUST-882",
    "module": "CRM"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Activity Timeline" subtitle="Recent activity across the suite" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
