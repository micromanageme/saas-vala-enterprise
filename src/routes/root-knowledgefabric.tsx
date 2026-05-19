import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-knowledgefabric")({
  head: () => ({ meta: [{ title: "Universal Knowledge Fabric — Universal Access Admin" }, { name: "description", content: "Cross-module semantic graph, enterprise knowledge linking, AI retrieval" }] }),
  component: Page,
});

function Page() {
  const { data: knowledgeData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-knowledgefabric"],
    queryFn: async () => {
      const response = await fetch("/api/root/knowledge-fabric?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch knowledge fabric data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Universal Knowledge Fabric" subtitle="Cross-module semantic graph, enterprise knowledge linking, AI retrieval" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Universal Knowledge Fabric"
          subtitle="Cross-module semantic graph, enterprise knowledge linking, AI retrieval"
          message="We couldn't load Universal Knowledge Fabric data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = knowledgeData?.data;
  const graph = data?.semanticGraph;
  const knowledge = data?.knowledgeLinks;

  const kpis = [
    { label: "Total Nodes", value: graph?.totalNodes.toLocaleString() || "0", delta: "—", up: true },
    { label: "Linked Entities", value: knowledge?.linkedEntities.toLocaleString() || "0", delta: "—", up: true },
    { label: "Completeness", value: knowledge?.completeness || "0%", delta: "—", up: knowledge?.completeness === '100%' },
  ];

  const rows = [
    { metric: "Total Nodes", value: graph?.totalNodes.toLocaleString() || "0", status: "OK" },
    { metric: "Total Edges", value: graph?.totalEdges.toLocaleString() || "0", status: "OK" },
    { metric: "Modules Indexed", value: graph?.modulesIndexed.toString() || "0", status: "OK" },
    { metric: "Knowledge Entities", value: knowledge?.totalKnowledgeEntities.toLocaleString() || "0", status: "OK" },
    { metric: "Orphan Entities", value: knowledge?.orphanEntities.toString() || "0", status: "OK" },
    { metric: "Mapped Ontologies", value: data?.ontologyMapping?.mappedOntologies.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Knowledge Fabric" subtitle="Cross-module semantic graph, enterprise knowledge linking, AI retrieval" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
