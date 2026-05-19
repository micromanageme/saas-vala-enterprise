import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-selfhealing")({
  head: () => ({ meta: [{ title: "Universal Self-Healing Core — Universal Access Admin" }, { name: "description", content: "Automatic service recovery, cache repair, queue repair, websocket recovery" }] }),
  component: Page,
});

function Page() {
  const { data: healingData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-selfhealing"],
    queryFn: async () => {
      const response = await fetch("/api/root/self-healing?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch self-healing data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Universal Self-Healing Core" subtitle="Automatic service recovery, cache repair, queue repair, websocket recovery" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Universal Self-Healing Core"
          subtitle="Automatic service recovery, cache repair, queue repair, websocket recovery"
          message="We couldn't load Universal Self-Healing Core data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = healingData?.data;
  const service = data?.serviceRecovery;
  const cache = data?.cacheRepair;
  const queue = data?.queueRepair;
  const websocket = data?.websocketRecovery;

  const kpis = [
    { label: "Healthy Services", value: `${service?.healthyServices}/${service?.totalServices}`, delta: "—", up: true },
    { label: "Recovered Services", value: service?.recoveredServices.toString() || "0", delta: "—", up: true },
    { label: "Recovered Connections", value: websocket?.recoveredConnections.toString() || "0", delta: "—", up: true },
  ];

  const rows = [
    { metric: "Total Services", value: service?.totalServices.toString() || "0", status: "OK" },
    { metric: "Healthy Services", value: service?.healthyServices.toString() || "0", status: "OK" },
    { metric: "Recovered Services", value: service?.recoveredServices.toString() || "0", status: "OK" },
    { metric: "Total Caches", value: cache?.totalCaches.toString() || "0", status: "OK" },
    { metric: "Total Queues", value: queue?.totalQueues.toString() || "0", status: "OK" },
    { metric: "Total Connections", value: websocket?.totalConnections.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Self-Healing Core" subtitle="Automatic service recovery, cache repair, queue repair, websocket recovery" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
