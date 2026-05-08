import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dependency-graph-engineer")({
  head: () => ({ meta: [{ title: "Dependency Graph Engineer — SaaS Vala" }, { name: "description", content: "Dependency graph engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: dependencyData, isLoading, error } = useQuery({
    queryKey: ["dependency-graph-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Dependency Graph Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Dependency Graph Engineer" subtitle="Dependency graph engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Dependency Graph Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Nodes Tracked", value: "1.2K", delta: "+100", up: true },
    { label: "Edges Analyzed", value: "5.5K", delta: "+500", up: true },
    { label: "Cycles Detected", value: "2", delta: "-1", up: true },
    { label: "Graph Depth", value: "8", delta: "+1", up: true },
  ];

  const columns = [
    { key: "service", label: "Service" },
    { key: "dependencies", label: "Dependencies" },
    { key: "level", label: "Dependency Level" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { service: "SVC-001", dependencies: "5", level: "1", status: "Healthy" },
    { service: "SVC-002", dependencies: "8", level: "2", status: "Healthy" },
    { service: "SVC-003", dependencies: "3", level: "1", status: "Healthy" },
    { service: "SVC-004", dependencies: "10", level: "3", status: "Warning" },
    { service: "SVC-005", dependencies: "6", level: "2", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Dependency Graph Engineer" subtitle="Dependency graph engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
