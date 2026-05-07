import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [{ title: "Welcome — SaaS Vala" }, { name: "description", content: "Onboarding & quick start" }] }),
  component: Page,
});

const kpis = [
  { label: "Setup", value: "78%", delta: "+12%", up: true },
  { label: "Modules Active", value: "25", delta: "+3", up: true },
  { label: "Team", value: "12", delta: "+2", up: true },
  { label: "Tips", value: "8", delta: "—", up: true }
];
const columns = [{ key: "step", label: "Step" }, { key: "status", label: "Status" }, { key: "owner", label: "Owner" }, { key: "eta", label: "ETA" }];
const rows = [
  {
    "step": "Configure company",
    "status": "Done",
    "owner": "Admin",
    "eta": "—"
  },
  {
    "step": "Invite team",
    "status": "In Progress",
    "owner": "HR",
    "eta": "2d"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Welcome" subtitle="Onboarding & quick start" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
