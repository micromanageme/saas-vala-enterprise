import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-microtimeline")({
  head: () => ({ meta: [{ title: "Micro Observability Timeline — Universal Access Admin" }, { name: "description", content: "Trace chronology reconstruction, distributed timestamp normalization, telemetry causality mapping" }] }),
  component: Page,
});

function Page() {
  const { data: timelineData, isLoading, error } = useQuery({
    queryKey: ["root-microtimeline"],
    queryFn: async () => {
      const response = await fetch("/api/root/micro-observability-timeline?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch micro observability timeline data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Micro Observability Timeline" subtitle="Trace chronology reconstruction, distributed timestamp normalization, telemetry causality mapping" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Micro Observability Timeline data</div>
      </AppShell>
    );
  }

  const data = timelineData?.data;
  const reconstruction = data?.traceChronologyReconstruction;
  const normalization = data?.distributedTimestampNormalization;

  const kpis = [
    { label: "Reconstruction Rate", value: reconstruction?.reconstructionRate || "0%", delta: "—", up: reconstruction?.reconstructionRate === '100%' },
    { label: "Normalized Timestamps", value: `${normalization?.normalizedTimestamps.toLocaleString()}/${normalization?.totalTimestamps.toLocaleString()}`, delta: "—", up: true },
    { label: "Mapped Causalities", value: `${data?.telemetryCausalityMapping?.mappedCausalities}/${data?.telemetryCausalityMapping?.totalMappings}`, delta: "—", up: data?.telemetryCausalityMapping?.unmappedCausalities === 0 },
  ] : [];

  const rows = [
    { metric: "Total Traces", value: reconstruction?.totalTraces.toLocaleString() || "0", status: "OK" },
    { metric: "Avg Skew", value: normalization?.avgSkew || "—", status: "OK" },
    { metric: "Mapping Depth", value: data?.telemetryCausalityMapping?.mappingDepth.toString() || "0", status: "OK" },
    { metric: "Stitched Replays", value: data?.forensicReplayStitching?.stitchedReplays.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Micro Observability Timeline" subtitle="Trace chronology reconstruction, distributed timestamp normalization, telemetry causality mapping" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
