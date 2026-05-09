import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/employee")({
  head: () => ({ meta: [{ title: "Employee Dashboard — SaaS Vala" }, { name: "description", content: "Employee workspace" }] }),
  component: Page,
});

function Page() {
  const { data: empData, isLoading, error } = useQuery({
    queryKey: ["employee-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Employee data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Employee Dashboard" subtitle="Employee workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Employee data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tasks Assigned", value: "8", delta: "-2", up: true },
    { label: "Tasks Completed", value: "12", delta: "+3", up: true },
    { label: "Hours This Week", value: "32", delta: "—", up: true },
    { label: "Performance", value: "92%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "task", label: "Task" },
    { key: "project", label: "Project" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { task: "Update API docs", project: "API v2", priority: "High", status: "In Progress" },
    { task: "Fix login bug", project: "Platform", priority: "Critical", status: "In Progress" },
    { task: "Code review", project: "Mobile App", priority: "Medium", status: "Pending" },
    { task: "Team meeting", project: "Operations", priority: "Low", status: "Scheduled" },
    { task: "Feature implementation", project: "AI Assistant", priority: "High", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="Employee Dashboard" subtitle="Employee workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
