import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/reseller")({
  head: () => ({ meta: [{ title: "Reseller Dashboard — SaaS Vala" }, { name: "description", content: "Reseller portal" }] }),
  component: Page,
});

function Page() {
  const { data: resellerData, isLoading, error } = useQuery({
    queryKey: ["reseller-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Reseller data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Reseller Dashboard" subtitle="Reseller portal" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Reseller data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Sales Volume", value: "$125K", delta: "+18%", up: true },
    { label: "Commission", value: "$12.5K", delta: "+15%", up: true },
    { label: "Clients", value: "45", delta: "+8", up: true },
    { label: "Tier Status", value: "Gold", delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "client", label: "Client" },
    { key: "product", label: "Product" },
    { key: "revenue", label: "Revenue" },
    { key: "commission", label: "Commission" },
  ];

  const rows = [
    { client: "Acme Corp", product: "Enterprise", revenue: "$25K", commission: "$2.5K" },
    { client: "TechStart Inc", product: "Pro", revenue: "$12K", commission: "$1.2K" },
    { client: "Global Ltd", product: "Enterprise", revenue: "$35K", commission: "$3.5K" },
    { client: "Innovate Co", product: "Basic", revenue: "$8K", commission: "$0.8K" },
    { client: "Future Systems", product: "Pro", revenue: "$15K", commission: "$1.5K" },
  ];

  return (
    <AppShell>
      <ModulePage title="Reseller Dashboard" subtitle="Reseller portal" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
