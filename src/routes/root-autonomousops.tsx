import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-autonomousops")({
  head: () => ({ meta: [{ title: "Root Autonomous Operations Core — Universal Access Admin" }, { name: "description", content: "Autonomous remediation, optimization, scaling, anomaly correction" }] }),
  component: Page,
});

function Page() {
  const { data: autonomousData, isLoading, error } = useQuery({
    queryKey: ["root-autonomousops"],
    queryFn: async () => {
      const response = await fetch("/api/root/autonomous-operations?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch autonomous operations data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Autonomous Operations Core" subtitle="Autonomous remediation, optimization, scaling, anomaly correction" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Autonomous Operations Core data</div>
      </AppShell>
    );
  }

  const data = autonomousData?.data;
  const remediation = data?.autonomousRemediation;
  const optimization = data?.autonomousOptimization;

  const kpis = [
    { label: "Remediation Rate", value: remediation?.remediationRate || "0%", delta: "—", up: true },
    { label: "Successful Optimizations", value: optimization?.successfulOptimizations.toString() || "0", delta: "—", up: true },
    { label: "Scaling Success", value: `${data?.autonomousScaling?.successfulScaling}/${data?.autonomousScaling?.totalScalingEvents}`, delta: "—", up: data?.autonomousScaling?.failedScaling === 0 },
  ];

  const rows = [
    { metric: "Total Incidents", value: remediation?.totalIncidents.toString() || "0", status: "OK" },
    { metric: "Auto Remediated", value: remediation?.autoRemediated.toString() || "0", status: "OK" },
    { metric: "Total Optimizations", value: optimization?.totalOptimizations.toString() || "0", status: "OK" },
    { metric: "Total Scaling Events", value: data?.autonomousScaling?.totalScalingEvents.toString() || "0", status: "OK" },
    { metric: "Total Anomalies", value: data?.autonomousAnomalyCorrection?.totalAnomalies.toString() || "0", status: "OK" },
    { metric: "Auto Corrected", value: data?.autonomousAnomalyCorrection?.autoCorrected.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Autonomous Operations Core" subtitle="Autonomous remediation, optimization, scaling, anomaly correction" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
