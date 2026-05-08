import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-ai")({
  head: () => ({ meta: [{ title: "AI Orchestration Center — Universal Access Admin" }, { name: "description", content: "Root-level AI model and agent control" }] }),
  component: Page,
});

function Page() {
  const { data: aiData, isLoading, error } = useQuery({
    queryKey: ["root-ai"],
    queryFn: async () => {
      const response = await fetch("/api/root/ai-orchestration?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch AI data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="AI Orchestration Center" subtitle="Root-level AI model and agent control" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load AI Orchestration Center data</div>
      </AppShell>
    );
  }

  const data = aiData?.data;
  const models = data?.models || [];

  const kpis = [
    { label: "Total Models", value: models.length.toString(), delta: "—", up: true },
    { label: "Active Models", value: models.filter((m: any) => m.status === 'ACTIVE').length.toString(), delta: "—", up: true },
    { label: "Total Agents", value: data?.agents?.length.toString() || "0", delta: "—", up: true },
    { label: "Total Calls", value: models.reduce((sum: number, m: any) => sum + m.calls, 0).toLocaleString(), delta: "—", up: true },
  ];

  const columns = [
    { key: "name", label: "Model" },
    { key: "provider", label: "Provider" },
    { key: "status", label: "Status" },
    { key: "calls", label: "Calls" },
    { key: "avgLatency", label: "Avg Latency" },
    { key: "cost", label: "Cost" },
  ];

  const rows = models.map((m: any) => ({
    name: m.name,
    provider: m.provider,
    status: m.status,
    calls: m.calls.toLocaleString(),
    avgLatency: `${m.avgLatency}ms`,
    cost: `$${m.cost.toLocaleString()}`,
  }));

  return (
    <AppShell>
      <ModulePage title="AI Orchestration Center" subtitle="Root-level AI model and agent control" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
