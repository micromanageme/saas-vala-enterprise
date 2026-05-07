import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/trail")({
  head: () => ({ meta: [{ title: "Audit Trail — SaaS Vala" }, { name: "description", content: "Change history" }] }),
  component: Page,
});

const kpis = [
  { label: "Changes (24h)", value: "12,420", delta: "+6%", up: true },
  { label: "Reverted", value: "3", delta: "—", up: true },
  { label: "Records", value: "842K", delta: "+1%", up: true },
  { label: "Users", value: "148", delta: "+2", up: true }
];
const columns = [{ key: "ts", label: "Time" }, { key: "user", label: "User" }, { key: "record", label: "Record" }, { key: "change", label: "Change" }];
const rows = [
  {
    "ts": "12:04",
    "user": "a.khan",
    "record": "SO-1042",
    "change": "status: Draft → Confirmed"
  },
  {
    "ts": "12:09",
    "user": "r.singh",
    "record": "CUST-882",
    "change": "email updated"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Audit Trail" subtitle="Change history" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
