import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit Logs — SaaS Vala" }, { name: "description", content: "Security & traceability" }] }),
  component: Page,
});

const kpis = [
  { label: "Events (24h)", value: "24,820", delta: "+4%", up: true },
  { label: "Critical", value: "3", delta: "-1", up: true },
  { label: "Failed Logins", value: "12", delta: "-4", up: true },
  { label: "Admin Actions", value: "148", delta: "+12", up: true }
];
const columns = [{ key: "ts", label: "Timestamp" }, { key: "user", label: "User" }, { key: "action", label: "Action" }, { key: "ip", label: "IP" }];
const rows = [
  {
    "ts": "12:04:21",
    "user": "admin@vala",
    "action": "role.update",
    "ip": "10.0.1.4"
  },
  {
    "ts": "12:09:48",
    "user": "a.khan",
    "action": "invoice.create",
    "ip": "10.0.1.22"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Audit Logs" subtitle="Security & traceability" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
