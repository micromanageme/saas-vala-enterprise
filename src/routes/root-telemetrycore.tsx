import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-telemetrycore")({
  head: () => ({ meta: [{ title: "Root Universal Telemetry Core — Universal Access Admin" }, { name: "description", content: "Telemetry federation, infinite-scale observability, ultra-high-frequency monitoring" }] }),
  component: Page,
});

function Page() {
  const { data: telemetryData, isLoading, error } = useQuery({
    queryKey: ["root-telemetrycore"],
    queryFn: async () => {
      const response = await fetch("/api/root/universal-telemetry?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch universal telemetry data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Universal Telemetry Core" subtitle="Telemetry federation, infinite-scale observability, ultra-high-frequency monitoring" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Universal Telemetry Core data</div>
      </AppShell>
    );
  }

  const data = telemetryData?.data;
  const federation = data?.telemetryFederation;
  const observability = data?.infiniteScaleObservability;

  const kpis = [
    { label: "Federated Sources", value: `${federation?.federatedSources}/${federation?.totalSources}`, delta: "—", up: true },
    { label: "Telemetry Rate", value: federation?.telemetryRate || "0", delta: "—", up: true },
    { label: "Coverage", value: data?.ultraHighFrequencyMonitoring?.coverage || "0%", delta: "—", up: data?.ultraHighFrequencyMonitoring?.coverage === '100%' },
  ] : [];

  const rows = [
    { metric: "Total Metrics", value: observability?.totalMetrics.toLocaleString() || "0", status: "OK" },
    { metric: "Sampling Rate", value: data?.ultraHighFrequencyMonitoring?.samplingRate || "—", status: "OK" },
    { metric: "Monitored Entities", value: data?.ultraHighFrequencyMonitoring?.totalMonitoredEntities.toString() || "0", status: "OK" },
    { metric: "Storage Retention", value: observability?.storageRetention || "—", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Universal Telemetry Core" subtitle="Telemetry federation, infinite-scale observability, ultra-high-frequency monitoring" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
