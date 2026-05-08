import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-computegrid")({
  head: () => ({ meta: [{ title: "Root Compute Grid — Universal Access Admin" }, { name: "description", content: "Cluster orchestration, distributed compute, edge compute mesh" }] }),
  component: Page,
});

function Page() {
  const { data: computeData, isLoading, error } = useQuery({
    queryKey: ["root-computegrid"],
    queryFn: async () => {
      const response = await fetch("/api/root/compute-grid?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch compute grid data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Compute Grid" subtitle="Cluster orchestration, distributed compute, edge compute mesh" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Compute Grid data</div>
      </AppShell>
    );
  }

  const data = computeData?.data;
  const clusters = data?.clusters || [];
  const workload = data?.workloadBalancing;

  const kpis = workload ? [
    { label: "Total Workloads", value: workload.totalWorkloads.toString(), delta: "—", up: true },
    { label: "Active", value: workload.activeWorkloads.toString(), delta: "—", up: true },
    { label: "Queued", value: workload.queuedWorkloads.toString(), delta: "—", up: workload.queuedWorkloads === 0 },
    { label: "Edge Nodes", value: data?.edgeComputeMesh?.edgeNodes.toString() || "0", delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "Cluster" },
    { key: "nodes", label: "Nodes" },
    { key: "status", label: "Status" },
    { key: "utilization", label: "Utilization" },
  ];

  const rows = clusters.map((c: any) => ({
    name: c.name,
    nodes: c.nodes.toString(),
    status: c.status,
    utilization: c.utilization,
  }));

  return (
    <AppShell>
      <ModulePage title="Root Compute Grid" subtitle="Cluster orchestration, distributed compute, edge compute mesh" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
