import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — SaaS Vala" }, { name: "description", content: "System alerts & inbox" }] }),
  component: Page,
});

const kpis = [
  { label: "Unread", value: "12", delta: "—", up: true },
  { label: "Today", value: "148", delta: "+22", up: true },
  { label: "Channels", value: "5", delta: "—", up: true },
  { label: "Failed", value: "0", delta: "—", up: true }
];
const columns = [{ key: "ts", label: "Time" }, { key: "title", label: "Title" }, { key: "channel", label: "Channel" }, { key: "status", label: "Status" }];
const rows = [
  {
    "ts": "12:04",
    "title": "New order SO-1042",
    "channel": "In-App",
    "status": "Delivered"
  },
  {
    "ts": "12:09",
    "title": "License expiring",
    "channel": "Email",
    "status": "Delivered"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Notifications" subtitle="System alerts & inbox" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
