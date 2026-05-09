import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-nanocache")({
  head: () => ({ meta: [{ title: "Nano Cache Coherency Fabric — Universal Access Admin" }, { name: "description", content: "Distributed cache reconciliation, cache mutation sequencing, stale propagation detection" }] }),
  component: Page,
});

function Page() {
  const { data: cacheData, isLoading, error } = useQuery({
    queryKey: ["root-nanocache"],
    queryFn: async () => {
      const response = await fetch("/api/root/nano-cache-coherency?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch nano cache coherency data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Nano Cache Coherency Fabric" subtitle="Distributed cache reconciliation, cache mutation sequencing, stale propagation detection" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Nano Cache Coherency Fabric data</div>
      </AppShell>
    );
  }

  const data = cacheData?.data;
  const reconciliation = data?.distributedCacheReconciliation;
  const sequencing = data?.cacheMutationSequencing;

  const kpis = [
    { label: "Reconciled Caches", value: `${reconciliation?.reconciledCaches}/${reconciliation?.totalReconciliations}`, delta: "—", up: reconciliation?.unreconciledCaches === 0 },
    { label: "Sequence Accuracy", value: sequencing?.sequenceAccuracy || "0%", delta: "—", up: sequencing?.sequenceAccuracy === '100%' },
    { label: "Healing Rate", value: data?.cacheDivergenceHealing?.healingRate || "0%", delta: "—", up: data?.cacheDivergenceHealing?.healingRate === '100%' },
  ];

  const rows = [
    { metric: "Avg Reconciliation Time", value: reconciliation?.avgReconciliationTime || "—", status: "OK" },
    { metric: "Total Mutations", value: sequencing?.totalMutations.toLocaleString() || "0", status: "OK" },
    { metric: "Stale Propagations", value: data?.stalePropagationDetection?.stalePropagations.toString() || "0", status: "OK" },
    { metric: "Healed Divergences", value: data?.cacheDivergenceHealing?.healedDivergences.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Nano Cache Coherency Fabric" subtitle="Distributed cache reconciliation, cache mutation sequencing, stale propagation detection" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
