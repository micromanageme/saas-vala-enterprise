import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/trade-analyst")({
  head: () => ({ meta: [{ title: "Trade Analyst — SaaS Vala" }, { name: "description", content: "Trade analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: tradeData, isLoading, error } = useQuery({
    queryKey: ["trade-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Trade Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Trade Analyst" subtitle="Trade analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Trade Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Markets Tracked", value: "45", delta: "+5", up: true },
    { label: "Reports Generated", value: "25", delta: "+3", up: true },
    { label: "Forecast Accuracy", value: "88%", delta: "+3%", up: true },
    { label: "Data Sources", value: "120", delta: "+15", up: true },
  ];

  const columns = [
    { key: "market", label: "Trade Market" },
    { key: "trend", label: "Trend" },
    { key: "volume", label: "Volume" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { market: "MKT-001", trend: "Bullish", volume: "$50M", status: "Growing" },
    { market: "MKT-002", trend: "Bearish", volume: "$30M", status: "Declining" },
    { market: "MKT-003", trend: "Neutral", volume: "$40M", status: "Stable" },
    { market: "MKT-004", trend: "Bullish", volume: "$60M", status: "Growing" },
    { market: "MKT-005", trend: "Neutral", volume: "$35M", status: "Stable" },
  ];

  return (
    <AppShell>
      <ModulePage title="Trade Analyst" subtitle="Trade analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
