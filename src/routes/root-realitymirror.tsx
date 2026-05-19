import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-realitymirror")({
  head: () => ({ meta: [{ title: "Universal Reality Mirror — Universal Access Admin" }, { name: "description", content: "Complete live ecosystem twin, realtime topology sync, operational simulation overlay" }] }),
  component: Page,
});

function Page() {
  const { data: realityData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-realitymirror"],
    queryFn: async () => {
      const response = await fetch("/api/root/reality-mirror?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch reality mirror data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Universal Reality Mirror" subtitle="Complete live ecosystem twin, realtime topology sync, operational simulation overlay" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Universal Reality Mirror"
          subtitle="Complete live ecosystem twin, realtime topology sync, operational simulation overlay"
          message="We couldn't load Universal Reality Mirror data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = realityData?.data;
  const twin = data?.liveEcosystemTwin;
  const predictive = data?.predictiveImpactVisualization;

  const kpis = [
    { label: "Synchronized Nodes", value: `${twin?.synchronizedNodes}/${twin?.totalNodes}`, delta: "—", up: true },
    { label: "Sync Latency", value: twin?.syncLatency || "—", delta: "—", up: true },
    { label: "Prediction Accuracy", value: predictive?.accuracy || "0%", delta: "—", up: parseFloat(predictive?.accuracy || '0') > 90 },
  ];

  const rows = [
    { metric: "Total Nodes", value: twin?.totalNodes.toString() || "0", status: "OK" },
    { metric: "Total Connections", value: data?.realtimeTopologySync?.totalConnections.toString() || "0", status: "OK" },
    { metric: "Active Simulations", value: data?.operationalSimulationOverlay?.activeSimulations.toString() || "0", status: "OK" },
    { metric: "Total Predictions", value: predictive?.totalPredictions.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Reality Mirror" subtitle="Complete live ecosystem twin, realtime topology sync, operational simulation overlay" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
