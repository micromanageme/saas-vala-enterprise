import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/cfo")({
  head: () => ({ meta: [{ title: "CFO Dashboard — SaaS Vala" }, { name: "description", content: "Chief Financial Officer - Financial oversight" }] }),
  component: Page,
});

function Page() {
  const { data: cfoData, isLoading, error } = useQuery({
    queryKey: ["cfo-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch CFO data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="CFO Dashboard" subtitle="Chief Financial Officer - Financial oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load CFO data</div>
      </AppShell>
    );
  }

  const data = cfoData?.data;
  const kpis = data?.kpis ? [
    { label: "Revenue", value: `$${(data.kpis.revenue / 1000000).toFixed(2)}M`, delta: `+${data.kpis.revenueDelta}%`, up: data.kpis.revenueDelta > 0 },
    { label: "EBITDA", value: `$${(data.kpis.ebitda / 1000000).toFixed(2)}M`, delta: `+${data.kpis.ebitdaDelta}%`, up: data.kpis.ebitdaDelta > 0 },
    { label: "Cash Flow", value: `$${(data.kpis.cash / 1000000).toFixed(2)}M`, delta: `+${data.kpis.cashDelta}%`, up: data.kpis.cashDelta > 0 },
    { label: "Burn Rate", value: `$${(data.kpis.burnRate / 1000).toFixed(0)}K/mo`, delta: "-5%", up: true },
  ];

  const columns = [
    { key: "category", label: "Category" },
    { key: "budget", label: "Budget" },
    { key: "actual", label: "Actual" },
    { key: "variance", label: "Variance" },
  ];

  const rows = [
    { category: "Engineering", budget: "$2.5M", actual: "$2.4M", variance: "-4%" },
    { category: "Marketing", budget: "$1.2M", actual: "$1.3M", variance: "+8%" },
    { category: "Operations", budget: "$800K", actual: "$750K", variance: "-6%" },
    { category: "Sales", budget: "$1.5M", actual: "$1.4M", variance: "-7%" },
    { category: "Infrastructure", budget: "$500K", actual: "$480K", variance: "-4%" },
  ];

  return (
    <AppShell>
      <ModulePage title="CFO Dashboard" subtitle="Chief Financial Officer - Financial oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
