import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-observability")({
  head: () => ({ meta: [{ title: "Observability Center — Universal Access Admin" }, { name: "description", content: "Root-level logs, metrics, and tracing" }] }),
  component: Page,
});

function Page() {
  const { data: observabilityData, isLoading, error } = useQuery({
    queryKey: ["root-observability"],
    queryFn: async () => {
      const response = await fetch("/api/root/observability?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch observability data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Observability Center" subtitle="Root-level logs, metrics, and tracing" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Observability Center data</div>
      </AppShell>
    );
  }

  const data = observabilityData?.data;
  const logs = data?.logs || [];
  const metrics = data?.metrics;

  const kpis = metrics ? [
    { label: "API Latency (p95)", value: `${metrics.apiLatency.p95}ms`, delta: "—", up: true },
    { label: "DB Latency (p95)", value: `${metrics.dbLatency.p95}ms`, delta: "—", up: true },
    { label: "Cache Hit Rate", value: `${metrics.cacheHitRate}%`, delta: "—", up: true },
    { label: "Error Rate", value: `${(metrics.errorRate * 100).toFixed(2)}%`, delta: "—", up: metrics.errorRate < 0.05 },
  ];

  const columns = [
    { key: "level", label: "Level" },
    { key: "action", label: "Action" },
    { key: "user", label: "User" },
    { key: "timestamp", label: "Timestamp" },
  ];

  const rows = logs.slice(0, 20).map((l: any) => ({
    level: l.level,
    action: l.action,
    user: l.user,
    timestamp: new Date(l.timestamp).toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Observability Center" subtitle="Root-level logs, metrics, and tracing" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
