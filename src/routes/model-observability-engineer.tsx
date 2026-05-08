import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/model-observability-engineer")({
  head: () => ({ meta: [{ title: "Model Observability Engineer — SaaS Vala" }, { name: "description", content: "Model observability engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: observabilityData, isLoading, error } = useQuery({
    queryKey: ["model-observability-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Model Observability Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Model Observability Engineer" subtitle="Model observability engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Model Observability Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Models Monitored", value: "25", delta: "+3", up: true },
    { label: "Alerts Triggered", value: "8", delta: "-2", up: true },
    { label: "Data Drift", value: "3%", delta: "-1%", up: true },
    { label: "Explainability", value: "92%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "model", label: "Model" },
    { key: "metric", label: "Key Metric" },
    { key: "drift", label: "Drift" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { model: "MODEL-001", metric: "Accuracy", drift: "2%", status: "Healthy" },
    { model: "MODEL-002", metric: "Precision", drift: "5%", status: "Warning" },
    { model: "MODEL-003", metric: "Recall", drift: "1%", status: "Healthy" },
    { model: "MODEL-004", metric: "F1 Score", drift: "3%", status: "Healthy" },
    { model: "MODEL-005", metric: "AUC", drift: "0%", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Model Observability Engineer" subtitle="Model observability engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
