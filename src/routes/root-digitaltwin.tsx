import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-digitaltwin")({
  head: () => ({ meta: [{ title: "Root Digital Twin — Universal Access Admin" }, { name: "description", content: "Live infrastructure mirror, topology graph, health overlays" }] }),
  component: Page,
});

function Page() {
  const { data: twinData, isLoading, error } = useQuery({
    queryKey: ["root-digitaltwin"],
    queryFn: async () => {
      const response = await fetch("/api/root/digital-twin?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch digital twin data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Digital Twin" subtitle="Live infrastructure mirror, topology graph, health overlays" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Digital Twin data</div>
      </AppShell>
    );
  }

  const data = twinData?.data;
  const infra = data?.infrastructureMirror;
  const topology = data?.topologyGraph;
  const health = data?.healthOverlays;

  const kpis = infra ? [
    { label: "Components", value: infra.components.toString(), delta: "—", up: true },
    { label: "Healthy", value: infra.healthy.toString(), delta: "—", up: true },
    { label: "Degraded", value: infra.degraded.toString(), delta: "—", up: infra.degraded === 0 },
    { label: "Nodes", value: topology?.nodes.toString() || "0", delta: "—", up: true },
  ] : [];

  const rows = health ? [
    { metric: "Overall Health", value: health.overallHealth, status: health.overallHealth === 'HEALTHY' ? 'OK' : 'WARNING' },
    { metric: "Critical Nodes", value: health.criticalNodes.toString(), status: health.criticalNodes === 0 ? 'OK' : 'CRITICAL' },
    { metric: "Warning Nodes", value: health.warningNodes.toString(), status: health.warningNodes === 0 ? 'OK' : 'WARNING' },
    { metric: "Healthy Nodes", value: health.healthyNodes.toString(), status: 'OK' },
  ] : [];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Digital Twin" subtitle="Live infrastructure mirror, topology graph, health overlays" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
