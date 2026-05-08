import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/mlops-engineer")({
  head: () => ({ meta: [{ title: "MLOps Engineer — SaaS Vala" }, { name: "description", content: "MLOps engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: mlopsData, isLoading, error } = useQuery({
    queryKey: ["mlops-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch MLOps Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="MLOps Engineer" subtitle="MLOps engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load MLOps Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Models Deployed", value: "25", delta: "+3", up: true },
    { label: "Pipeline Success", value: "94%", delta: "+2%", up: true },
    { label: "Training Jobs", value: "150", delta: "+20", up: true },
    { label: "Model Drift", value: "2.5%", delta: "-0.5%", up: true },
  ];

  const columns = [
    { key: "model", label: "ML Model" },
    { key: "type", label: "Type" },
    { key: "accuracy", label: "Accuracy" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { model: "MODEL-001", type: "Classification", accuracy: "95%", status: "Production" },
    { model: "MODEL-002", type: "Regression", accuracy: "92%", status: "Production" },
    { model: "MODEL-003", type: "NLP", accuracy: "88%", status: "Staging" },
    { model: "MODEL-004", type: "Computer Vision", accuracy: "90%", status: "Production" },
    { model: "MODEL-005", type: "Anomaly Detection", accuracy: "96%", status: "Training" },
  ];

  return (
    <AppShell>
      <ModulePage title="MLOps Engineer" subtitle="MLOps engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
