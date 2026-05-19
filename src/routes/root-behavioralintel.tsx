import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-behavioralintel")({
  head: () => ({ meta: [{ title: "Root Behavioral Intelligence Engine — Universal Access Admin" }, { name: "description", content: "User behavior learning, anomaly intent prediction, threat pattern intelligence" }] }),
  component: Page,
});

function Page() {
  const { data: behavioralData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-behavioralintel"],
    queryFn: async () => {
      const response = await fetch("/api/root/behavioral-intelligence?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch behavioral intelligence data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Root Behavioral Intelligence Engine" subtitle="User behavior learning, anomaly intent prediction, threat pattern intelligence" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Root Behavioral Intelligence Engine"
          subtitle="User behavior learning, anomaly intent prediction, threat pattern intelligence"
          message="We couldn't load Root Behavioral Intelligence Engine data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = behavioralData?.data;
  const learning = data?.userBehaviorLearning;
  const prediction = data?.anomalyIntentPrediction;

  const kpis = [
    { label: "Profiled Users", value: `${learning?.profiledUsers}/${learning?.totalUsers}`, delta: "—", up: true },
    { label: "Prediction Accuracy", value: prediction?.accuracy || "0%", delta: "—", up: parseFloat(prediction?.accuracy || '0') > 90 },
    { label: "Pattern Confidence", value: data?.threatPatternIntelligence?.patternConfidence || "0%", delta: "—", up: parseFloat(data?.threatPatternIntelligence?.patternConfidence || '0') > 90 },
  ];

  const rows = [
    { metric: "Behaviors Learned", value: learning?.totalBehaviorsLearned.toString() || "0", status: "OK" },
    { metric: "Total Predictions", value: prediction?.totalPredictions.toString() || "0", status: "OK" },
    { metric: "Total Patterns", value: data?.threatPatternIntelligence?.totalPatterns.toString() || "0", status: "OK" },
    { metric: "Automatic Responses", value: data?.adaptiveGovernanceResponse?.automaticResponses.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Behavioral Intelligence Engine" subtitle="User behavior learning, anomaly intent prediction, threat pattern intelligence" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
