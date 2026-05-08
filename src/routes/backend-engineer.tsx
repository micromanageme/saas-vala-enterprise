import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/backend-engineer")({
  head: () => ({ meta: [{ title: "Backend Engineer — SaaS Vala" }, { name: "description", content: "Backend development" }] }),
  component: Page,
});

function Page() {
  const { data: beData, isLoading, error } = useQuery({
    queryKey: ["backend-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Backend Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Backend Engineer" subtitle="Backend development" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Backend Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "APIs Built", value: "6", delta: "+2", up: true },
    { label: "Endpoints", value: "24", delta: "+5", up: true },
    { label: "Tests Written", value: "45", delta: "+8", up: true },
    { label: "Performance", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "task", label: "Task" },
    { key: "project", label: "Project" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { task: "API v2 endpoints", project: "API Gateway", priority: "High", status: "In Progress" },
    { task: "Database optimization", project: "Performance", priority: "High", status: "In Progress" },
    { task: "Authentication refresh", project: "Security", priority: "Critical", status: "Pending" },
    { task: "Microservice migration", project: "Architecture", priority: "Medium", status: "Pending" },
    { task: "Cache implementation", project: "Performance", priority: "Medium", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="Backend Engineer" subtitle="Backend development" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
