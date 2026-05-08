import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/fullstack-engineer")({
  head: () => ({ meta: [{ title: "Full Stack Engineer — SaaS Vala" }, { name: "description", content: "Full stack development" }] }),
  component: Page,
});

function Page() {
  const { data: fsData, isLoading, error } = useQuery({
    queryKey: ["fullstack-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Full Stack Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Full Stack Engineer" subtitle="Full stack development" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Full Stack Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Features Delivered", value: "5", delta: "+1", up: true },
    { label: "Frontend Commits", value: "23", delta: "+5", up: true },
    { label: "Backend Commits", value: "18", delta: "+4", up: true },
    { label: "Cross-team Reviews", value: "7", delta: "+2", up: true },
  ];

  const columns = [
    { key: "task", label: "Task" },
    { key: "project", label: "Project" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { task: "User profile feature", project: "Platform", priority: "High", status: "In Progress" },
    { task: "Reporting module", project: "Analytics", priority: "Medium", status: "In Progress" },
    { task: "Notification system", project: "Platform", priority: "High", status: "Pending" },
    { task: "File upload feature", project: "Documents", priority: "Medium", status: "Pending" },
    { task: "Search functionality", project: "Platform", priority: "Low", status: "Backlog" },
  ];

  return (
    <AppShell>
      <ModulePage title="Full Stack Engineer" subtitle="Full stack development" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
