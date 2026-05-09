import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-contextawareness")({
  head: () => ({ meta: [{ title: "Root Context Awareness Engine — Universal Access Admin" }, { name: "description", content: "Contextual permission synthesis, situational workflow adaptation, dynamic policy intelligence" }] }),
  component: Page,
});

function Page() {
  const { data: contextData, isLoading, error } = useQuery({
    queryKey: ["root-contextawareness"],
    queryFn: async () => {
      const response = await fetch("/api/root/context-awareness?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch context awareness data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Context Awareness Engine" subtitle="Contextual permission synthesis, situational workflow adaptation, dynamic policy intelligence" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Context Awareness Engine data</div>
      </AppShell>
    );
  }

  const data = contextData?.data;
  const permission = data?.contextualPermissionSynthesis;
  const workflow = data?.situationalWorkflowAdaptation;

  const kpis = [
    { label: "Synthesized Permissions", value: `${permission?.synthesizedPermissions}/${permission?.totalContexts}`, delta: "—", up: true },
    { label: "Adaptation Rate", value: workflow?.adaptationRate || "0%", delta: "—", up: workflow?.adaptationRate === '100%' },
    { label: "Cognition Accuracy", value: data?.realtimeEnvironmentCognition?.cognitionAccuracy || "0%", delta: "—", up: parseFloat(data?.realtimeEnvironmentCognition?.cognitionAccuracy || '0') > 95 },
  ];

  const rows = [
    { metric: "Synthesis Time", value: permission?.synthesisTime || "—", status: "OK" },
    { metric: "Total Workflows", value: workflow?.totalWorkflows.toString() || "0", status: "OK" },
    { metric: "Dynamic Policies", value: data?.dynamicPolicyIntelligence?.dynamicPolicies.toString() || "0", status: "OK" },
    { metric: "Recognized Entities", value: data?.realtimeEnvironmentCognition?.recognizedEntities.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Context Awareness Engine" subtitle="Contextual permission synthesis, situational workflow adaptation, dynamic policy intelligence" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
