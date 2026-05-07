import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/offline")({
  head: () => ({ meta: [{ title: "Offline Sync — SaaS Vala" }, { name: "description", content: "Offline-first queue & resolution" }] }),
  component: Page,
});

const kpis = [
  { label: "Queued Ops", value: "24", delta: "—", up: true },
  { label: "Synced (24h)", value: "12,420", delta: "+8%", up: true },
  { label: "Conflicts", value: "2", delta: "-1", up: true },
  { label: "Devices", value: "148", delta: "+12", up: true }
];
const columns = [{ key: "device", label: "Device" }, { key: "user", label: "User" }, { key: "pending", label: "Pending" }, { key: "lastSync", label: "Last Sync" }];
const rows = [
  {
    "device": "POS-Term-04",
    "user": "L. Verma",
    "pending": 3,
    "lastSync": "2m ago"
  },
  {
    "device": "Tablet-12",
    "user": "A. Khan",
    "pending": 0,
    "lastSync": "just now"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Offline Sync" subtitle="Offline-first queue & resolution" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
