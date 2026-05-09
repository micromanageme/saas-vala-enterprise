import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-aisafety")({
  head: () => ({ meta: [{ title: "Root AI Safety Center — Universal Access Admin" }, { name: "description", content: "Hallucination monitoring, abuse detection, policy enforcement" }] }),
  component: Page,
});

function Page() {
  const { data: safetyData, isLoading, error } = useQuery({
    queryKey: ["root-aisafety"],
    queryFn: async () => {
      const response = await fetch("/api/root/ai-safety?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch AI safety data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root AI Safety Center" subtitle="Hallucination monitoring, abuse detection, policy enforcement" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root AI Safety Center data</div>
      </AppShell>
    );
  }

  const data = safetyData?.data;
  const hallucination = data?.hallucinationMonitoring;
  const abuse = data?.abuseDetection;
  const policy = data?.policyEnforcement;

  const kpis = [
    { label: "Total Queries", value: hallucination?.totalQueries.toLocaleString() || "0", delta: "—", up: true },
    { label: "Hallucinations", value: hallucination?.detectedHallucinations.toString() || "0", delta: "—", up: hallucination?.detectedHallucinations === 0 },
    { label: "Abuse Flagged", value: abuse?.flaggedQueries.toString() || "0", delta: "—", up: abuse?.flaggedQueries === 0 },
    { label: "Violations", value: policy?.policyViolations.toString() || "0", delta: "—", up: policy?.policyViolations === 0 },
  ];

  const rows = [
    { metric: "Hallucination Rate", value: `${((hallucination?.detectedHallucinations || 0) / (hallucination?.totalQueries || 1) * 100).toFixed(4)}%`, status: 'OK' },
    { metric: "False Positive Rate", value: `${(hallucination?.falsePositiveRate || 0) * 100}%`, status: 'OK' },
    { metric: "Abuse Blocked", value: abuse?.blockedQueries.toString() || "0", status: 'OK' },
    { metric: "Auto Blocked", value: policy?.autoBlocked.toString() || "0", status: 'OK' },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root AI Safety Center" subtitle="Hallucination monitoring, abuse detection, policy enforcement" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
