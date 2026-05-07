import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/sessions")({
  head: () => ({ meta: [{ title: "Sessions — SaaS Vala" }, { name: "description", content: "Active user sessions" }] }),
  component: Page,
});

const kpis = [
  { label: "Active", value: "1,284", delta: "+42", up: true },
  { label: "Devices", value: "842", delta: "+12", up: true },
  { label: "New (24h)", value: "148", delta: "+18", up: true },
  { label: "Suspicious", value: "2", delta: "—", up: true }
];
const columns = [{ key: "user", label: "User" }, { key: "device", label: "Device" }, { key: "ip", label: "IP" }, { key: "since", label: "Since" }];
const rows = [
  {
    "user": "a.khan",
    "device": "MacOS · Chrome",
    "ip": "10.0.1.4",
    "since": "2h ago"
  },
  {
    "user": "r.singh",
    "device": "iOS · Safari",
    "ip": "10.0.1.22",
    "since": "18m ago"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Sessions" subtitle="Active user sessions" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
