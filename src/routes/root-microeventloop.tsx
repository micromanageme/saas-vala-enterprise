import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-microeventloop")({
  head: () => ({ meta: [{ title: "Micro Event Loop Observability — Universal Access Admin" }, { name: "description", content: "Event-loop starvation detection, async dead-zone tracing, microtask queue stabilization" }] }),
  component: Page,
});

function Page() {
  const { data: eventData, isLoading, error } = useQuery({
    queryKey: ["root-microeventloop"],
    queryFn: async () => {
      const response = await fetch("/api/root/micro-event-loop?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch micro event loop data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Micro Event Loop Observability" subtitle="Event-loop starvation detection, async dead-zone tracing, microtask queue stabilization" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Micro Event Loop Observability data</div>
      </AppShell>
    );
  }

  const data = eventData?.data;
  const starvation = data?.eventLoopStarvationDetection;
  const deadzone = data?.asyncDeadZoneTracing;

  const kpis = [
    { label: "Starvation Events", value: starvation?.starvationEvents.toString() || "0", delta: "—", up: starvation?.starvationEvents === 0 },
    { label: "Avg Loop Time", value: starvation?.avgLoopTime || "—", delta: "—", up: true },
    { label: "Dead Zones Found", value: deadzone?.deadZonesFound.toString() || "0", delta: "—", up: deadzone?.deadZonesFound === 0 },
  ] : [];

  const rows = [
    { metric: "Total Checks", value: starvation?.totalChecks.toLocaleString() || "0", status: "OK" },
    { metric: "Total Traces", value: deadzone?.totalTraces.toString() || "0", status: "OK" },
    { metric: "Stabilized Queues", value: data?.microtaskQueueStabilization?.stabilizedQueues.toString() || "0", status: "OK" },
    { metric: "Recovered Chains", value: data?.callbackChainRecovery?.recoveredChains.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Micro Event Loop Observability" subtitle="Event-loop starvation detection, async dead-zone tracing, microtask queue stabilization" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
