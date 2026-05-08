import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ai-manager")({
  head: () => ({ meta: [{ title: "AI Manager — SaaS Vala" }, { name: "description", content: "AI operations management" }] }),
  component: Page,
});

function Page() {
  const { data: aiData, isLoading, error } = useQuery({
    queryKey: ["ai-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch AI Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="AI Manager" subtitle="AI operations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load AI Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "AI Models Active", value: "12", delta: "+2", up: true },
    { label: "API Calls/Day", value: "1.2M", delta: "+15%", up: true },
    { label: "Avg Response", value: "120ms", delta: "-20ms", up: true },
    { label: "Accuracy", value: "94.5%", delta: "+1.2%", up: true },
  ] : [];

  const columns = [
    { key: "model", label: "Model" },
    { key: "type", label: "Type" },
    { key: "requests", label: "Requests" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { model: "GPT Assistant", type: "Chat", requests: "450K", status: "Active" },
    { model: "Code Generator", type: "Code", requests: "320K", status: "Active" },
    { model: "Sentiment Analyzer", type: "NLP", requests: "180K", status: "Active" },
    { model: "Image Generator", type: "Vision", requests: "150K", status: "Active" },
    { model: "Translation", type: "NLP", requests: "100K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="AI Manager" subtitle="AI operations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
