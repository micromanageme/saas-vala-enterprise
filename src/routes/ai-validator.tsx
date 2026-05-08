import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ai-validator")({
  head: () => ({ meta: [{ title: "AI Validator — SaaS Vala" }, { name: "description", content: "AI validation workspace" }] }),
  component: Page,
});

function Page() {
  const { data: validatorData, isLoading, error } = useQuery({
    queryKey: ["ai-validator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch AI Validator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="AI Validator" subtitle="AI validation workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load AI Validator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Models Validated", value: "23", delta: "+4", up: true },
    { label: "Validation Pass Rate", value: "94%", delta: "+2%", up: true },
    { label: "Issues Found", value: "15", delta: "+3", up: false },
    { key: "falsePositives", label: "False Positives", value: "2%", delta: "-1%", up: true },
  ];

  const columns = [
    { key: "model", label: "AI Model" },
    { key: "type", label: "Type" },
    { key: "accuracy", label: "Accuracy" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { model: "Chatbot v3.2", type: "NLP", accuracy: "96%", status: "Validated" },
    { model: "Image Classifier v2.1", type: "Vision", accuracy: "94%", status: "Validated" },
    { model: "Sentiment Analyzer v1.5", type: "NLP", accuracy: "92%", status: "Review" },
    { model: "Fraud Detection v4.0", type: "ML", accuracy: "98%", status: "Validated" },
    { model: "Recommendation Engine v2.3", type: "ML", accuracy: "90%", status: "Needs Review" },
  ];

  return (
    <AppShell>
      <ModulePage title="AI Validator" subtitle="AI validation workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
