import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-nanoai")({
  head: () => ({ meta: [{ title: "Nano AI Governance Loop — Universal Access Admin" }, { name: "description", content: "Recursive AI behavior validation, prompt mutation tracing, autonomous drift prevention" }] }),
  component: Page,
});

function Page() {
  const { data: aiData, isLoading, error } = useQuery({
    queryKey: ["root-nanoai"],
    queryFn: async () => {
      const response = await fetch("/api/root/nano-ai-governance?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch nano AI governance data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Nano AI Governance Loop" subtitle="Recursive AI behavior validation, prompt mutation tracing, autonomous drift prevention" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Nano AI Governance Loop data</div>
      </AppShell>
    );
  }

  const data = aiData?.data;
  const validation = data?.recursiveAIBehaviorValidation;
  const mutation = data?.promptMutationTracing;

  const kpis = [
    { label: "Validation Rate", value: validation?.validationRate || "0%", delta: "—", up: parseFloat(validation?.validationRate || '0') > 99 },
    { label: "Traced Mutations", value: `${mutation?.tracedMutations}/${mutation?.totalPrompts}`, delta: "—", up: mutation?.untracedMutations === 0 },
    { label: "Prevention Rate", value: data?.autonomousDriftPrevention?.preventionRate || "0%", delta: "—", up: data?.autonomousDriftPrevention?.preventionRate === '100%' },
  ] : [];

  const rows = [
    { metric: "Total Validations", value: validation?.totalValidations.toString() || "0", status: "OK" },
    { metric: "Mutation Depth", value: mutation?.mutationDepth.toString() || "0", status: "OK" },
    { metric: "Drifts Detected", value: data?.autonomousDriftPrevention?.driftsDetected.toString() || "0", status: "OK" },
    { metric: "Tracked Responses", value: data?.modelResponseLineageTracking?.trackedResponses.toLocaleString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Nano AI Governance Loop" subtitle="Recursive AI behavior validation, prompt mutation tracing, autonomous drift prevention" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
