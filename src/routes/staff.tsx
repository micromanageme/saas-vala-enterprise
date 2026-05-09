import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/staff")({
  head: () => ({ meta: [{ title: "Staff Dashboard — SaaS Vala" }, { name: "description", content: "Staff workspace" }] }),
  component: Page,
});

function Page() {
  const { data: staffData, isLoading, error } = useQuery({
    queryKey: ["staff-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Staff data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Staff Dashboard" subtitle="Staff workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Staff data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tasks Assigned", value: "5", delta: "-1", up: true },
    { label: "Tasks Completed", value: "8", delta: "+2", up: true },
    { label: "Hours This Week", value: "28", delta: "—", up: true },
    { label: "Performance", value: "88%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "task", label: "Task" },
    { key: "project", label: "Project" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { task: "Data entry", project: "CRM", priority: "Medium", status: "In Progress" },
    { task: "Customer support", project: "Support", priority: "High", status: "In Progress" },
    { task: "Report generation", project: "Analytics", priority: "Low", status: "Pending" },
    { task: "Documentation", project: "Knowledge Base", priority: "Medium", status: "Pending" },
    { task: "Email responses", project: "Communication", priority: "High", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Staff Dashboard" subtitle="Staff workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
