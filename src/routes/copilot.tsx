import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/copilot")({
  head: () => ({ meta: [{ title: "AI Copilot — SaaS Vala" }, { name: "description", content: "Live AI chat assistant" }] }),
  component: Page,
});

const kpis = [
  { label: "Sessions", value: "1,284", delta: "+18%", up: true },
  { label: "Messages", value: "24,820", delta: "+12%", up: true },
  { label: "Resolved", value: "82%", delta: "+4%", up: true },
  { label: "Latency", value: "420ms", delta: "-40ms", up: true }
];
const columns = [{ key: "user", label: "User" }, { key: "topic", label: "Topic" }, { key: "turns", label: "Turns" }, { key: "status", label: "Status" }];
const rows = [
  {
    "user": "a.khan",
    "topic": "Invoice question",
    "turns": 6,
    "status": "Resolved"
  },
  {
    "user": "r.singh",
    "topic": "Inventory query",
    "turns": 3,
    "status": "Active"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="AI Copilot" subtitle="Live AI chat assistant" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
