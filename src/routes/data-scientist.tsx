import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/data-scientist")({
  head: () => ({ meta: [{ title: "Data Scientist — SaaS Vala" }, { name: "description", content: "Data science workspace" }] }),
  component: Page,
});

function Page() {
  const { data: dataSciData, isLoading, error } = useQuery({
    queryKey: ["data-scientist-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Data Scientist data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Data Scientist" subtitle="Data science workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Data Scientist data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Models Deployed", value: "8", delta: "+2", up: true },
    { label: "Experiments", value: "23", delta: "+5", up: true },
    { label: "Model Accuracy", value: "94.5%", delta: "+1.2%", up: true },
    { label: "Predictions/Day", value: "1.5M", delta: "+0.3M", up: true },
  ];

  const columns = [
    { key: "model", label: "Model" },
    { key: "type", label: "Type" },
    { key: "accuracy", label: "Accuracy" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { model: "Churn Prediction", type: "Classification", accuracy: "92%", status: "Production" },
    { model: "Sales Forecast", type: "Regression", accuracy: "88%", status: "Production" },
    { model: "Recommendation Engine", type: "Collaborative Filtering", accuracy: "85%", status: "Production" },
    { model: "Sentiment Analysis", type: "NLP", accuracy: "91%", status: "Testing" },
    { model: "Fraud Detection", type: "Anomaly Detection", accuracy: "96%", status: "Production" },
  ];

  return (
    <AppShell>
      <ModulePage title="Data Scientist" subtitle="Data science workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
