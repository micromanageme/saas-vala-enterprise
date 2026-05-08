import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-observabilityfabric")({
  head: () => ({ meta: [{ title: "Root Observability Fabric — Universal Access Admin" }, { name: "description", content: "Unified telemetry, distributed tracing, correlation engine" }] }),
  component: Page,
});

function Page() {
  const { data: observabilityData, isLoading, error } = useQuery({
    queryKey: ["root-observabilityfabric"],
    queryFn: async () => {
      const response = await fetch("/api/root/observability-fabric?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch observability fabric data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Observability Fabric" subtitle="Unified telemetry, distributed tracing, correlation engine" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Observability Fabric data</div>
      </AppShell>
    );
  }

  const data = observabilityData?.data;
  const telemetry = data?.unifiedTelemetry;
  const tracing = data?.distributedTracing;

  const kpis = [
    { label: "Metrics/s", value: telemetry?.metricsPerSecond.toLocaleString() || "0", delta: "—", up: true },
    { label: "Logs/s", value: telemetry?.logsPerSecond.toLocaleString() || "0", delta: "—", up: true },
    { label: "Traces/s", value: telemetry?.tracesPerSecond.toLocaleString() || "0", delta: "—", up: true },
    { label: "Active Traces", value: tracing?.activeTraces.toString() || "0", delta: "—", up: true },
  ] : [];

  const rows = [
    { metric: "Metrics Per Second", value: telemetry?.metricsPerSecond.toLocaleString() || "0", status: "OK" },
    { metric: "Logs Per Second", value: telemetry?.logsPerSecond.toLocaleString() || "0", status: "OK" },
    { metric: "Traces Per Second", value: telemetry?.tracesPerSecond.toLocaleString() || "0", status: "OK" },
    { metric: "Correlations/s", value: data?.correlationEngine?.correlationsPerSecond.toString() || "0", status: "OK" },
    { metric: "Detected Anomalies", value: data?.correlationEngine?.detectedAnomalies.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Observability Fabric" subtitle="Unified telemetry, distributed tracing, correlation engine" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
