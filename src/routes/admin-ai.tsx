import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin-ai")({
  head: () => ({ meta: [{ title: "AI Control Center — Super Admin" }, { name: "description", content: "AI model and usage management" }] }),
  component: Page,
});

function Page() {
  const { data: aiData, isLoading, error } = useQuery({
    queryKey: ["admin-ai"],
    queryFn: async () => {
      const response = await fetch("/api/admin/ai-control?type=all");
      if (!response.ok) throw new Error("Failed to fetch AI data");
      return response.json();
    },
    refetchInterval: 15000, // Refresh every 15 seconds for realtime AI monitoring
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="AI Control Center" subtitle="AI model and usage management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load AI data</div>
      </AppShell>
    );
  }

  const data = aiData?.data;
  const kpis = data?.kpis ? [
    { label: "Total AI Calls", value: data.kpis.totalAiCalls.toLocaleString(), delta: `+${data.kpis.callsDelta}%`, up: data.kpis.callsDelta > 0 },
    { label: "Monthly Calls", value: data.kpis.monthlyAiCalls.toLocaleString(), delta: `+${data.kpis.callsDelta}%`, up: data.kpis.callsDelta > 0 },
    { label: "Active Models", value: data.kpis.activeModels.toString(), delta: "—", up: true },
    { label: "Error Rate", value: `${(data.kpis.errorRate * 100).toFixed(2)}%`, delta: `${data.kpis.errorRateDelta}%`, up: data.kpis.errorRateDelta < 0 },
  ];

  const columns = [
    { key: "name", label: "Model" },
    { key: "status", label: "Status" },
    { key: "calls", label: "Calls" },
    { key: "avgLatency", label: "Avg Latency" },
  ];

  const rows = data?.models?.map((m: any) => ({
    name: m.name,
    status: m.status,
    calls: m.calls.toLocaleString(),
    avgLatency: `${m.avgLatency}ms`,
  })) || [];

  return (
    <AppShell>
      <ModulePage title="AI Control Center" subtitle="AI model and usage management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
