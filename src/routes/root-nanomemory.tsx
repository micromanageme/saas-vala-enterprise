import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-nanomemory")({
  head: () => ({ meta: [{ title: "Nano Memory Stability Layer — Universal Access Admin" }, { name: "description", content: "Retained-reference isolation, heap fragmentation tracking, memory leak ancestry" }] }),
  component: Page,
});

function Page() {
  const { data: memoryData, isLoading, error } = useQuery({
    queryKey: ["root-nanomemory"],
    queryFn: async () => {
      const response = await fetch("/api/root/nano-memory-stability?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch nano memory stability data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Nano Memory Stability Layer" subtitle="Retained-reference isolation, heap fragmentation tracking, memory leak ancestry" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Nano Memory Stability Layer data</div>
      </AppShell>
    );
  }

  const data = memoryData?.data;
  const isolation = data?.retainedReferenceIsolation;
  const fragmentation = data?.heapFragmentationTracking;

  const kpis = [
    { label: "Isolation Rate", value: isolation?.isolationRate || "0%", delta: "—", up: isolation?.isolationRate === '100%' },
    { label: "Fragmentation Score", value: fragmentation?.fragmentationScore || "0%", delta: "—", up: parseFloat(fragmentation?.fragmentationScore || '0') < 10 },
    { label: "Memory Leak Rate", value: data?.memoryLeakAncestry?.leakRate || "0%", delta: "—", up: data?.memoryLeakAncestry?.leakRate === '0' },
  ] : [];

  const rows = [
    { metric: "Total References", value: isolation?.totalReferences.toLocaleString() || "0", status: "OK" },
    { metric: "Total Checks", value: fragmentation?.totalChecks.toString() || "0", status: "OK" },
    { metric: "Leaks Detected", value: data?.memoryLeakAncestry?.totalLeaksDetected.toString() || "0", status: "OK" },
    { metric: "Avg Collection Time", value: data?.runtimeGarbageHarmonization?.avgCollectionTime || "—", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Nano Memory Stability Layer" subtitle="Retained-reference isolation, heap fragmentation tracking, memory leak ancestry" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
