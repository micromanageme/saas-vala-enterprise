import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ceo")({
  head: () => ({ meta: [{ title: "CEO — SaaS Vala" }, { name: "description", content: "Chief Executive Officer" }] }),
  component: Page,
});

function Page() {
  const { data: ceoData, isLoading, error } = useQuery({
    queryKey: ["ceo-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch CEO data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="CEO" subtitle="Chief Executive Officer" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load CEO data</div>
      </AppShell>
    );
  }

  const data = ceoData?.data;
  const financial = data?.financial;
  const kpis = financial ? [
    { label: "Revenue", value: `$${(financial.totalRevenue / 1000).toFixed(0)}K`, delta: "+15%", up: true },
    { label: "Growth", value: financial.growthRate, delta: "+5%", up: true },
    { label: "Margin", value: financial.profitMargin, delta: "+3%", up: true },
    { label: "Market Cap", value: `$${(financial.marketCap / 1000000).toFixed(0)}M`, delta: "+20%", up: true },
  ];

  const columns = [
    { key: "goal", label: "Strategic Goal" },
    { key: "progress", label: "Progress" },
    { key: "target", label: "Target" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { goal: "Revenue Growth", progress: "85%", target: "$100M", status: "On Track" },
    { goal: "Market Expansion", progress: "60%", target: "5 regions", status: "In Progress" },
    { goal: "Product Launch", progress: "90%", target: "Q3 2024", status: "On Track" },
    { goal: "Team Growth", progress: "75%", target: "500 employees", status: "On Track" },
    { goal: "IPO Preparation", progress: "40%", target: "2025", status: "Planning" },
  ];

  return (
    <AppShell>
      <ModulePage title="CEO" subtitle="Chief Executive Officer" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
