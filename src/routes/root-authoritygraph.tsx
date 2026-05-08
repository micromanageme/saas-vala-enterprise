import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-authoritygraph")({
  head: () => ({ meta: [{ title: "Root Absolute Authority Graph — Universal Access Admin" }, { name: "description", content: "Authority chain visualization, privilege escalation tracing, conflict resolution" }] }),
  component: Page,
});

function Page() {
  const { data: authorityData, isLoading, error } = useQuery({
    queryKey: ["root-authoritygraph"],
    queryFn: async () => {
      const response = await fetch("/api/root/absolute-authority-graph?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch absolute authority graph data");
      return response.json();
    },
    refetchInterval: 20000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Absolute Authority Graph" subtitle="Authority chain visualization, privilege escalation tracing, conflict resolution" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Absolute Authority Graph data</div>
      </AppShell>
    );
  }

  const data = authorityData?.data;
  const chain = data?.authorityChainVisualization;
  const escalation = data?.privilegeEscalationTracing;

  const kpis = [
    { label: "Total Chains", value: chain?.totalChains.toString() || "0", delta: "—", up: true },
    { label: "Traced Escalations", value: `${escalation?.tracedEscalations}/${escalation?.totalEscalations}`, delta: "—", up: true },
    { label: "Resolution Rate", value: data?.inheritanceConflictResolution?.resolutionRate || "0%", delta: "—", up: data?.inheritanceConflictResolution?.resolutionRate === '100%' },
  ] : [];

  const rows = [
    { metric: "Chain Depth", value: chain?.chainDepth.toString() || "0", status: "OK" },
    { metric: "Total Nodes", value: data?.totalGovernanceTopology?.totalNodes.toString() || "0", status: "OK" },
    { metric: "Total Edges", value: data?.totalGovernanceTopology?.totalEdges.toString() || "0", status: "OK" },
    { metric: "Topology Status", value: data?.totalGovernanceTopology?.topologyStatus || "—", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Absolute Authority Graph" subtitle="Authority chain visualization, privilege escalation tracing, conflict resolution" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
