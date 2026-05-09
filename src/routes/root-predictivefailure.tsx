import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-predictivefailure")({
  head: () => ({ meta: [{ title: "Root Predictive Failure Engine — Universal Access Admin" }, { name: "description", content: "Predictive outage detection, anomaly forecasting, proactive remediation planning" }] }),
  component: Page,
});

function Page() {
  const { data: failureData, isLoading, error } = useQuery({
    queryKey: ["root-predictivefailure"],
    queryFn: async () => {
      const response = await fetch("/api/root/predictive-failure-engine?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch predictive failure engine data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Predictive Failure Engine" subtitle="Predictive outage detection, anomaly forecasting, proactive remediation planning" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Predictive Failure Engine data</div>
      </AppShell>
    );
  }

  const data = failureData?.data;
  const detection = data?.predictiveOutageDetection;
  const forecasting = data?.anomalyForecasting;

  const kpis = [
    { label: "Prediction Accuracy", value: detection?.accuracy || "0%", delta: "—", up: parseFloat(detection?.accuracy || '0') > 90 },
    { label: "Forecasted Anomalies", value: `${forecasting?.forecastedAnomalies}/${forecasting?.totalAnomalies}`, delta: "—", up: true },
    { label: "Defense Rate", value: data?.selfDefenseOrchestration?.defenseRate || "0%", delta: "—", up: parseFloat(data?.selfDefenseOrchestration?.defenseRate || '0') > 95 },
  ];

  const rows = [
    { metric: "Total Predictions", value: detection?.totalPredictions.toString() || "0", status: "OK" },
    { metric: "Total Anomalies", value: forecasting?.totalAnomalies.toString() || "0", status: "OK" },
    { metric: "Total Plans", value: data?.proactiveRemediationPlanning?.totalPlans.toString() || "0", status: "OK" },
    { metric: "Total Threats", value: data?.selfDefenseOrchestration?.totalThreats.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Predictive Failure Engine" subtitle="Predictive outage detection, anomaly forecasting, proactive remediation planning" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
