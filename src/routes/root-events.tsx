import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-events")({
  head: () => ({ meta: [{ title: "Root Event Orchestrator — Universal Access Admin" }, { name: "description", content: "Event stream monitoring, replay, and distributed tracing" }] }),
  component: Page,
});

function Page() {
  const { data: eventData, isLoading, error } = useQuery({
    queryKey: ["root-events"],
    queryFn: async () => {
      const response = await fetch("/api/root/event-orchestrator?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch event orchestrator data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Event Orchestrator" subtitle="Event stream monitoring, replay, and distributed tracing" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Event Orchestrator data</div>
      </AppShell>
    );
  }

  const data = eventData?.data;
  const streams = data?.eventStreams || [];
  const tracing = data?.distributedTracing;

  const kpis = tracing ? [
    { label: "Active Traces", value: tracing.activeTraces.toString(), delta: "—", up: true },
    { label: "Completed", value: tracing.completedTraces.toLocaleString(), delta: "—", up: true },
    { label: "Failed", value: tracing.failedTraces.toString(), delta: "—", up: tracing.failedTraces === 0 },
    { label: "Avg Duration", value: tracing.avgTraceDuration, delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "Stream" },
    { key: "throughput", label: "Throughput" },
    { key: "lag", label: "Lag" },
    { key: "status", label: "Status" },
  ];

  const rows = streams.map((s: any) => ({
    name: s.name,
    throughput: s.throughput.toString(),
    lag: s.lag,
    status: s.status,
  }));

  return (
    <AppShell>
      <ModulePage title="Root Event Orchestrator" subtitle="Event stream monitoring, replay, and distributed tracing" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
