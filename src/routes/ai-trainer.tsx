import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ai-trainer")({
  head: () => ({ meta: [{ title: "AI Trainer — SaaS Vala" }, { name: "description", content: "AI model training" }] }),
  component: Page,
});

function Page() {
  const { data: trainerData, isLoading, error } = useQuery({
    queryKey: ["ai-trainer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch AI Trainer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="AI Trainer" subtitle="AI model training" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load AI Trainer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Models Trained", value: "8", delta: "+2", up: true },
    { label: "Training Hours", value: "234", delta: "+45", up: true },
    { label: "Dataset Size", value: "2.5TB", delta: "+0.5TB", up: true },
    { label: "Model Accuracy", value: "94.5%", delta: "+1.2%", up: true },
  ];

  const columns = [
    { key: "model", label: "Model" },
    { key: "epoch", label: "Epoch" },
    { key: "accuracy", label: "Accuracy" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { model: "Sentiment Analyzer", epoch: "45/50", accuracy: "94.2%", status: "Training" },
    { model: "Classification Model", epoch: "50/50", accuracy: "95.8%", status: "Complete" },
    { model: "NER Model", epoch: "32/40", accuracy: "91.5%", status: "Training" },
    { model: "Translation Model", epoch: "60/60", accuracy: "93.2%", status: "Complete" },
    { model: "Summarization Model", epoch: "25/30", accuracy: "89.8%", status: "Training" },
  ];

  return (
    <AppShell>
      <ModulePage title="AI Trainer" subtitle="AI model training" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
