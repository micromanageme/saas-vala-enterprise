import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-dependency")({
  head: () => ({ meta: [{ title: "Universal Dependency Engine — Universal Access Admin" }, { name: "description", content: "Dependency graph visualization, circular detection, runtime healing" }] }),
  component: Page,
});

function Page() {
  const { data: dependencyData, isLoading, error } = useQuery({
    queryKey: ["root-dependency"],
    queryFn: async () => {
      const response = await fetch("/api/root/dependency-engine?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch dependency engine data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Dependency Engine" subtitle="Dependency graph visualization, circular detection, runtime healing" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Dependency Engine data</div>
      </AppShell>
    );
  }

  const data = dependencyData?.data;
  const graph = data?.dependencyGraph;
  const healing = data?.runtimeDependencyHealing;

  const kpis = [
    { label: "Total Nodes", value: graph?.totalNodes.toString() || "0", delta: "—", up: true },
    { label: "Total Edges", value: graph?.totalEdges.toString() || "0", delta: "—", up: true },
    { label: "Circular Dependencies", value: graph?.circularDependencies.toString() || "0", delta: "—", up: graph?.circularDependencies === 0 },
  ];

  const rows = [
    { metric: "Total Dependencies", value: healing?.totalDependencies.toString() || "0", status: "OK" },
    { metric: "Healthy Dependencies", value: healing?.healthyDependencies.toString() || "0", status: "OK" },
    { metric: "Unhealthy Dependencies", value: healing?.unhealthyDependencies.toString() || "0", status: "OK" },
    { metric: "Orphan Dependencies", value: data?.orphanCleanup?.orphanDependencies.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Dependency Engine" subtitle="Dependency graph visualization, circular detection, runtime healing" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
