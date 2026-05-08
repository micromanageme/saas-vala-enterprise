import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-microwebsocket")({
  head: () => ({ meta: [{ title: "Micro WebSocket Recovery — Universal Access Admin" }, { name: "description", content: "Socket resurrection flow, packet sequence correction, realtime state convergence" }] }),
  component: Page,
});

function Page() {
  const { data: wsData, isLoading, error } = useQuery({
    queryKey: ["root-microwebsocket"],
    queryFn: async () => {
      const response = await fetch("/api/root/micro-websocket-recovery?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch micro websocket recovery data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Micro WebSocket Recovery" subtitle="Socket resurrection flow, packet sequence correction, realtime state convergence" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Micro WebSocket Recovery data</div>
      </AppShell>
    );
  }

  const data = wsData?.data;
  const resurrection = data?.socketResurrectionFlow;
  const correction = data?.packetSequenceCorrection;

  const kpis = [
    { label: "Resurrection Rate", value: resurrection?.resurrectionRate || "0%", delta: "—", up: parseFloat(resurrection?.resurrectionRate || '0') > 95 },
    { label: "Correction Rate", value: correction?.correctionRate || "0%", delta: "—", up: parseFloat(correction?.correctionRate || '0') < 1 },
    { label: "Converged States", value: `${data?.realtimeStateConvergence?.convergedStates}/${data?.realtimeStateConvergence?.totalConvergences}`, delta: "—", up: data?.realtimeStateConvergence?.divergentStates === 0 },
  ] : [];

  const rows = [
    { metric: "Total Resurrections", value: resurrection?.totalResurrections.toString() || "0", status: "OK" },
    { metric: "Total Packets", value: correction?.totalPackets.toLocaleString() || "0", status: "OK" },
    { metric: "Avg Convergence Time", value: data?.realtimeStateConvergence?.avgConvergenceTime || "—", status: "OK" },
    { metric: "Ghosts Cleaned", value: data?.connectionGhostCleanup?.ghostsCleaned.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Micro WebSocket Recovery" subtitle="Socket resurrection flow, packet sequence correction, realtime state convergence" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
