import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/model-governance-officer")({
  head: () => ({ meta: [{ title: "Model Governance Officer — SaaS Vala" }, { name: "description", content: "Model governance oversight" }] }),
  component: Page,
});

function Page() {
  const { data: modelGovData, isLoading, error } = useQuery({
    queryKey: ["model-governance-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Model Governance Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Model Governance Officer" subtitle="Model governance oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Model Governance Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Models Governed", value: "15", delta: "+3", up: true },
    { label: "Governance Score", value: "94%", delta: "+2%", up: true },
    { label: "Documentation", value: "92%", delta: "+5%", up: true },
    { label: "Version Control", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "model", label: "Model" },
    { key: "version", label: "Version" },
    { key: "stage", label: "Stage" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { model: "GPT Assistant", version: "v2.3", stage: "Production", status: "Approved" },
    { model: "Image Classifier", version: "v1.5", stage: "Staging", status: "Testing" },
    { model: "Sentiment Analyzer", version: "v3.1", stage: "Production", status: "Approved" },
    { model: "Translation Engine", version: "v2.0", stage: "Development", status: "In Progress" },
    { model: "Voice Recognition", version: "v1.2", stage: "Production", status: "Approved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Model Governance Officer" subtitle="Model governance oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
