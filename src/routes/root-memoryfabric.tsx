import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-memoryfabric")({
  head: () => ({ meta: [{ title: "Universal Memory Fabric — Universal Access Admin" }, { name: "description", content: "Distributed memory persistence, state continuity preservation, long-session resilience" }] }),
  component: Page,
});

function Page() {
  const { data: memoryData, isLoading, error } = useQuery({
    queryKey: ["root-memoryfabric"],
    queryFn: async () => {
      const response = await fetch("/api/root/memory-fabric?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch memory fabric data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Memory Fabric" subtitle="Distributed memory persistence, state continuity preservation, long-session resilience" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Memory Fabric data</div>
      </AppShell>
    );
  }

  const data = memoryData?.data;
  const persistence = data?.distributedMemoryPersistence;
  const continuity = data?.stateContinuityPreservation;

  const kpis = [
    { label: "Active Nodes", value: `${persistence?.activeNodes}/${persistence?.totalMemoryNodes}`, delta: "—", up: true },
    { label: "Continuity Rate", value: continuity?.continuityRate || "0%", delta: "—", up: continuity?.continuityRate === '100%' },
    { label: "Total Memory", value: persistence?.totalMemory || "0", delta: "—", up: true },
  ];

  const rows = [
    { metric: "Total States", value: continuity?.totalStates.toString() || "0", status: "OK" },
    { metric: "Resilient Sessions", value: data?.longSessionResilience?.resilientSessions.toString() || "0", status: "OK" },
    { metric: "Total Reconciliations", value: data?.memoryReconciliation?.totalReconciliations.toString() || "0", status: "OK" },
    { metric: "Avg Session Duration", value: data?.longSessionResilience?.avgSessionDuration || "—", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Memory Fabric" subtitle="Distributed memory persistence, state continuity preservation, long-session resilience" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
