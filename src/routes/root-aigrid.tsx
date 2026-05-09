import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-aigrid")({
  head: () => ({ meta: [{ title: "Universal AI Orchestration Grid — Universal Access Admin" }, { name: "description", content: "Multi-agent coordination, AI workflow graph, inference balancing" }] }),
  component: Page,
});

function Page() {
  const { data: aiGridData, isLoading, error } = useQuery({
    queryKey: ["root-aigrid"],
    queryFn: async () => {
      const response = await fetch("/api/root/ai-orchestration-grid?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch AI orchestration grid data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal AI Orchestration Grid" subtitle="Multi-agent coordination, AI workflow graph, inference balancing" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal AI Orchestration Grid data</div>
      </AppShell>
    );
  }

  const data = aiGridData?.data;
  const agents = data?.multiAgentCoordination;
  const workflows = data?.aiWorkflowGraph;

  const kpis = [
    { label: "Active Agents", value: agents?.activeAgents.toString() || "0", delta: "—", up: true },
    { label: "Coordinated Agents", value: agents?.coordinatedAgents.toString() || "0", delta: "—", up: true },
    { label: "Completed Workflows", value: workflows?.completedWorkflows.toLocaleString() || "0", delta: "—", up: true },
  ];

  const rows = [
    { metric: "Total Agents", value: agents?.totalAgents.toString() || "0", status: "OK" },
    { metric: "Active Agents", value: agents?.activeAgents.toString() || "0", status: "OK" },
    { metric: "Avg Coordination Latency", value: agents?.avgCoordinationLatency || "0", status: "OK" },
    { metric: "Total Workflows", value: workflows?.totalWorkflows.toString() || "0", status: "OK" },
    { metric: "Active Workflows", value: workflows?.activeWorkflows.toString() || "0", status: "OK" },
    { metric: "Failed Workflows", value: workflows?.failedWorkflows.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal AI Orchestration Grid" subtitle="Multi-agent coordination, AI workflow graph, inference balancing" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
