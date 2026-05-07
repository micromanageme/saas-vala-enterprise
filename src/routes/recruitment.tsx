import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/recruitment")({
  head: () => ({ meta: [{ title: "Recruitment — SaaS Vala" }, { name: "description", content: "Hiring pipeline" }] }),
  component: Page,
});

const kpis = [
  { label: "Open Roles", value: "24", delta: "+3", up: true },
  { label: "Applicants", value: "842", delta: "+62", up: true },
  { label: "Interviews", value: "48", delta: "+8", up: true },
  { label: "Offers", value: "6", delta: "+2", up: true }
];
const columns = [{ key: "role", label: "Role" }, { key: "candidates", label: "Candidates" }, { key: "stage", label: "Stage" }, { key: "owner", label: "Owner" }];
const rows = [
  {
    "role": "Senior Engineer",
    "candidates": 84,
    "stage": "Interview",
    "owner": "CTO"
  },
  {
    "role": "Sales Lead",
    "candidates": 42,
    "stage": "Screening",
    "owner": "VP Sales"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Recruitment" subtitle="Hiring pipeline" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
