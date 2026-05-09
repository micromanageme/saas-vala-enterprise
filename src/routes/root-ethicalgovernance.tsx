import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-ethicalgovernance")({
  head: () => ({ meta: [{ title: "Root Ethical Governance Engine — Universal Access Admin" }, { name: "description", content: "AI ethics enforcement, bias monitoring, explainability tracking" }] }),
  component: Page,
});

function Page() {
  const { data: ethicalData, isLoading, error } = useQuery({
    queryKey: ["root-ethicalgovernance"],
    queryFn: async () => {
      const response = await fetch("/api/root/ethical-governance?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch ethical governance data");
      return response.json();
    },
    refetchInterval: 20000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Ethical Governance Engine" subtitle="AI ethics enforcement, bias monitoring, explainability tracking" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Ethical Governance Engine data</div>
      </AppShell>
    );
  }

  const data = ethicalData?.data;
  const ethics = data?.aiEthicsEnforcement;
  const bias = data?.biasMonitoring;

  const kpis = [
    { label: "Compliant Actions", value: `${ethics?.compliantActions}/${ethics?.totalAIActions}`, delta: "—", up: ethics?.nonCompliantActions === 0 },
    { label: "Biased Models", value: bias?.biasedModels.toString() || "0", delta: "—", up: bias?.biasedModels === 0 },
    { label: "Avg Bias Score", value: bias?.avgBiasScore?.toString() || "0", delta: "—", up: bias?.avgBiasScore < 0.1 },
  ];

  const rows = [
    { metric: "Total AI Actions", value: ethics?.totalAIActions.toLocaleString() || "0", status: "OK" },
    { metric: "Total Models", value: bias?.totalModels.toString() || "0", status: "OK" },
    { metric: "Explainable Decisions", value: data?.explainabilityTracking?.explainableDecisions.toLocaleString() || "0", status: "OK" },
    { metric: "Active Policies", value: data?.policyConstrainedAutomation?.activePolicies.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Ethical Governance Engine" subtitle="AI ethics enforcement, bias monitoring, explainability tracking" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
