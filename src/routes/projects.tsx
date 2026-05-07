import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — SaaS Vala" }, { name: "description", content: "Tasks, sprints & gantt" }] }),
  component: Page,
});

const kpis = [
  { label: "Active", value: "42", delta: "+4", up: true },
  { label: "Open Tasks", value: "312", delta: "+22", up: true },
  { label: "Sprints", value: "8", delta: "+1", up: true },
  { label: "Bugs", value: "24", delta: "-3", up: true }
];
const columns = [{ key: "name", label: "Project" }, { key: "lead", label: "Lead" }, { key: "progress", label: "Progress" }, { key: "status", label: "Status" }];
const rows = [
  {
    "name": "Vala Platform v3",
    "lead": "CTO",
    "progress": "68%",
    "status": "On Track"
  },
  {
    "name": "POS Mobile",
    "lead": "PM",
    "progress": "42%",
    "status": "At Risk"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Projects" subtitle="Tasks, sprints & gantt" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
