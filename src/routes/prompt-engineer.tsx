import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/prompt-engineer")({
  head: () => ({ meta: [{ title: "Prompt Engineer — SaaS Vala" }, { name: "description", content: "AI prompt engineering" }] }),
  component: Page,
});

function Page() {
  const { data: promptData, isLoading, error } = useQuery({
    queryKey: ["prompt-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Prompt Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Prompt Engineer" subtitle="AI prompt engineering" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Prompt Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Prompts Created", value: "45", delta: "+8", up: true },
    { label: "Accuracy Score", value: "94%", delta: "+2%", up: true },
    { label: "Response Quality", value: "4.6/5", delta: "+0.3", up: true },
    { label: "Optimization Iterations", value: "12", delta: "+3", up: true },
  ];

  const columns = [
    { key: "prompt", label: "Prompt Template" },
    { key: "model", label: "Model" },
    { key: "accuracy", label: "Accuracy" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { prompt: "Customer Support Bot", model: "GPT-4", accuracy: "95%", status: "Active" },
    { prompt: "Code Generator", model: "Claude", accuracy: "92%", status: "Active" },
    { prompt: "Content Writer", model: "GPT-3.5", accuracy: "88%", status: "Testing" },
    { prompt: "Data Analyzer", model: "Custom", accuracy: "90%", status: "Active" },
    { prompt: "Translation Engine", model: "GPT-4", accuracy: "96%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Prompt Engineer" subtitle="AI prompt engineering" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
