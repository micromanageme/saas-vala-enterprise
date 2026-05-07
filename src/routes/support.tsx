import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support — SaaS Vala" }, { name: "description", content: "Tickets, SLA & live chat" }] }),
  component: Page,
});

const kpis = [
  { label: "Open", value: "148", delta: "-12", up: true },
  { label: "SLA Hit", value: "98%", delta: "+1%", up: true },
  { label: "CSAT", value: "4.7", delta: "+0.1", up: true },
  { label: "Avg Reply", value: "12m", delta: "-2m", up: true }
];
const columns = [{ key: "id", label: "#" }, { key: "subject", label: "Subject" }, { key: "priority", label: "Priority" }, { key: "status", label: "Status" }];
const rows = [
  {
    "id": "T-8821",
    "subject": "Login issue",
    "priority": "High",
    "status": "Open"
  },
  {
    "id": "T-8822",
    "subject": "Invoice query",
    "priority": "Normal",
    "status": "Pending"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Support" subtitle="Tickets, SLA & live chat" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
