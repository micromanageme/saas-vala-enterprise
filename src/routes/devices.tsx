import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/devices")({
  head: () => ({ meta: [{ title: "Devices — SaaS Vala" }, { name: "description", content: "Registered devices" }] }),
  component: Page,
});

const kpis = [
  { label: "Devices", value: "842", delta: "+12", up: true },
  { label: "Trusted", value: "812", delta: "+10", up: true },
  { label: "Pending", value: "18", delta: "—", up: true },
  { label: "Blocked", value: "12", delta: "—", up: true }
];
const columns = [{ key: "name", label: "Device" }, { key: "user", label: "User" }, { key: "os", label: "OS" }, { key: "status", label: "Status" }];
const rows = [
  {
    "name": "MBP-A.Khan",
    "user": "a.khan",
    "os": "macOS 15",
    "status": "Trusted"
  },
  {
    "name": "iPhone-R.S",
    "user": "r.singh",
    "os": "iOS 18",
    "status": "Trusted"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Devices" subtitle="Registered devices" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
