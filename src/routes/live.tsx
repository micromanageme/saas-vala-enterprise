import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/live")({
  head: () => ({ meta: [{ title: "Live Analytics — SaaS Vala" }, { name: "description", content: "Real-time metrics" }] }),
  component: Page,
});

function Page() {
  const { data: liveData, isLoading, error } = useQuery({
    queryKey: ["live"],
    queryFn: async () => {
      const response = await fetch("/api/live?type=all");
      if (!response.ok) throw new Error("Failed to fetch Live Analytics data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Live Analytics" subtitle="Real-time metrics" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Live Analytics data</div>
      </AppShell>
    );
  }

  const data = liveData?.data;
  const kpis = data?.kpis ? [
    { label: "Active Now", value: data.kpis.activeNow.toLocaleString(), delta: `+${data.kpis.activeNowDelta}`, up: data.kpis.activeNowDelta > 0 },
    { label: "Events/s", value: data.kpis.eventsPerSecond.toString(), delta: `+${data.kpis.eventsPerSecondDelta}`, up: data.kpis.eventsPerSecondDelta > 0 },
    { label: "Errors", value: `${data.kpis.errors}%`, delta: `${data.kpis.errorsDelta}%`, up: data.kpis.errorsDelta < 0 },
    { label: "Latency", value: `${data.kpis.latency}ms`, delta: `${data.kpis.latencyDelta}ms`, up: data.kpis.latencyDelta < 0 }
  ];

  const columns = [{ key: "metric", label: "Metric" }, { key: "value", label: "Value" }, { key: "change", label: "Change" }, { key: "timestamp", label: "Time" }];
  const rows = data?.metrics?.map((m: any) => ({
    metric: m.metric,
    value: m.value.toString(),
    change: m.change > 0 ? `+${m.change}` : m.change.toString(),
    timestamp: 'now'
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Live Analytics" subtitle="Real-time metrics" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
