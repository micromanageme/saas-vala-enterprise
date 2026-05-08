import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-metacontrol")({
  head: () => ({ meta: [{ title: "Universal Meta Control Layer — Universal Access Admin" }, { name: "description", content: "System-of-systems visibility, global orchestration graph, universal dependency oversight" }] }),
  component: Page,
});

function Page() {
  const { data: metaData, isLoading, error } = useQuery({
    queryKey: ["root-metacontrol"],
    queryFn: async () => {
      const response = await fetch("/api/root/meta-control?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch meta control data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Meta Control Layer" subtitle="System-of-systems visibility, global orchestration graph, universal dependency oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Meta Control Layer data</div>
      </AppShell>
    );
  }

  const data = metaData?.data;
  const systems = data?.systemOfSystems;
  const orchestration = data?.globalOrchestrationGraph;
  const oversight = data?.universalDependencyOversight;

  const kpis = [
    { label: "Total Systems", value: systems?.totalSystems.toString() || "0", delta: "—", up: true },
    { label: "Active Systems", value: systems?.activeSystems.toString() || "0", delta: "—", up: true },
    { label: "Orchestratable Nodes", value: orchestration?.orchestratableNodes.toString() || "0", delta: "—", up: true },
  ];

  const rows = [
    { metric: "Total Systems", value: systems?.totalSystems.toString() || "0", status: "OK" },
    { metric: "Active Systems", value: systems?.activeSystems.toString() || "0", status: "OK" },
    { metric: "Degraded Systems", value: systems?.degradedSystems.toString() || "0", status: "OK" },
    { metric: "Total Nodes", value: orchestration?.totalNodes.toString() || "0", status: "OK" },
    { metric: "Total Edges", value: orchestration?.totalEdges.toString() || "0", status: "OK" },
    { metric: "Complete Visibility", value: oversight?.completeVisibility ? "Yes" : "No", status: oversight?.completeVisibility ? "OK" : "WARNING" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Meta Control Layer" subtitle="System-of-systems visibility, global orchestration graph, universal dependency oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
