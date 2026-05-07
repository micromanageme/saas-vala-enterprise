import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/approvals")({
  head: () => ({ meta: [{ title: "Approvals — SaaS Vala" }, { name: "description", content: "Workflow approvals" }] }),
  component: Page,
});

const kpis = [
  { label: "Pending", value: "24", delta: "—", up: true },
  { label: "Approved (24h)", value: "148", delta: "+18", up: true },
  { label: "Rejected", value: "3", delta: "—", up: true },
  { label: "Avg TTA", value: "2.4h", delta: "-0.4h", up: true }
];
const columns = [{ key: "ref", label: "Ref" }, { key: "type", label: "Type" }, { key: "requester", label: "Requester" }, { key: "status", label: "Status" }];
const rows = [
  {
    "ref": "EXP-1042",
    "type": "Expense",
    "requester": "a.khan",
    "status": "Pending"
  },
  {
    "ref": "PO-882",
    "type": "Purchase",
    "requester": "r.singh",
    "status": "Approved"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Approvals" subtitle="Workflow approvals" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
