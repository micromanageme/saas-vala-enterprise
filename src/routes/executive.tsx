import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/executive")({
  head: () => ({ meta: [{ title: "Executive Dashboard — SaaS Vala" }, { name: "description", content: "C-suite overview" }] }),
  component: Page,
});

function Page() {
  const { data: executiveData, isLoading, error } = useQuery({
    queryKey: ["executive"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Executive data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Executive Dashboard" subtitle="C-suite overview" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Executive data</div>
      </AppShell>
    );
  }

  const data = executiveData?.data;
  const kpis = data?.kpis ? [
    { label: "Revenue", value: `$${(data.kpis.revenue / 1000000).toFixed(2)}M`, delta: `+${data.kpis.revenueDelta}%`, up: data.kpis.revenueDelta > 0 },
    { label: "EBITDA", value: `$${(data.kpis.ebitda / 1000000).toFixed(2)}M`, delta: `+${data.kpis.ebitdaDelta}%`, up: data.kpis.ebitdaDelta > 0 },
    { label: "Cash", value: `$${(data.kpis.cash / 1000000).toFixed(2)}M`, delta: `+${data.kpis.cashDelta}%`, up: data.kpis.cashDelta > 0 },
    { label: "NPS", value: data.kpis.nps.toString(), delta: `+${data.kpis.npsDelta}`, up: data.kpis.npsDelta > 0 }
  ];

  const columns = [{ key: "kpi", label: "KPI" }, { key: "target", label: "Target" }, { key: "actual", label: "Actual" }, { key: "status", label: "Status" }];
  const rows = data?.targets?.map((t: any) => ({
    kpi: t.kpi,
    target: typeof t.target === 'number' && t.target > 1000 ? `$${(t.target / 1000).toFixed(0)}K` : t.target,
    actual: typeof t.actual === 'number' && t.actual > 1000 ? `$${(t.actual / 1000).toFixed(0)}K` : t.actual,
    status: t.status
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Executive Dashboard" subtitle="C-suite overview" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
