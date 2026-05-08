import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/frontend-engineer")({
  head: () => ({ meta: [{ title: "Frontend Engineer — SaaS Vala" }, { name: "description", content: "Frontend development" }] }),
  component: Page,
});

function Page() {
  const { data: feData, isLoading, error } = useQuery({
    queryKey: ["frontend-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Frontend Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Frontend Engineer" subtitle="Frontend development" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Frontend Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "PRs Submitted", value: "8", delta: "+2", up: true },
    { label: "Components Built", value: "12", delta: "+3", up: true },
    { label: "Code Review", value: "5", delta: "+1", up: true },
    { label: "Bugs Fixed", value: "3", delta: "-2", up: true },
  ];

  const columns = [
    { key: "task", label: "Task" },
    { key: "project", label: "Project" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { task: "Dashboard redesign", project: "UI Overhaul", priority: "High", status: "In Progress" },
    { task: "Component library", project: "Design System", priority: "Medium", status: "In Progress" },
    { task: "Performance optimization", project: "Platform", priority: "High", status: "Pending" },
    { task: "Mobile responsive", project: "Mobile App", priority: "Medium", status: "Pending" },
    { task: "Accessibility audit", project: "Compliance", priority: "Low", status: "Scheduled" },
  ];

  return (
    <AppShell>
      <ModulePage title="Frontend Engineer" subtitle="Frontend development" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
