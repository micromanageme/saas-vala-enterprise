import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/threats")({
  head: () => ({ meta: [{ title: "Threats — SaaS Vala" }, { name: "description", content: "Threat alerts & firewall" }] }),
  component: Page,
});

const kpis = [
  { label: "Open", value: "3", delta: "-1", up: true },
  { label: "Blocked (24h)", value: "1,284", delta: "+42", up: true },
  { label: "Critical", value: "0", delta: "—", up: true },
  { label: "Score", value: "A+", delta: "—", up: true }
];
const columns = [{ key: "ts", label: "Time" }, { key: "type", label: "Type" }, { key: "source", label: "Source" }, { key: "action", label: "Action" }];
const rows = [
  {
    "ts": "12:04",
    "type": "Brute force",
    "source": "45.x.x.12",
    "action": "Blocked"
  },
  {
    "ts": "12:09",
    "type": "Bot scan",
    "source": "18.x.x.4",
    "action": "Blocked"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Threats" subtitle="Threat alerts & firewall" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
