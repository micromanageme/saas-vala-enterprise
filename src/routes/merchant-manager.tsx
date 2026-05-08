import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/merchant-manager")({
  head: () => ({ meta: [{ title: "Merchant Manager — SaaS Vala" }, { name: "description", content: "Merchant management" }] }),
  component: Page,
});

function Page() {
  const { data: merchantMgrData, isLoading, error } = useQuery({
    queryKey: ["merchant-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Merchant Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Merchant Manager" subtitle="Merchant management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Merchant Manager data</div>
      </AppShell>
    );
  }

  const data = merchantMgrData?.analytics?.marketplace;
  const kpis = data ? [
    { label: "Total Merchants", value: "45", delta: "+5", up: true },
    { label: "Active Merchants", value: "42", delta: "+4", up: true },
    { label: "Merchant Revenue", value: `$${(data.totalRevenue / 1000).toFixed(0)}K`, delta: "+12%", up: true },
    { label: "Avg Order Value", value: "$125", delta: "+8%", up: true },
  ] : [];

  const columns = [
    { key: "merchant", label: "Merchant" },
    { key: "products", label: "Products" },
    { key: "revenue", label: "Revenue" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { merchant: "TechStore Inc", products: "45", revenue: "$125K", status: "Active" },
    { merchant: "SoftwareHub", products: "32", revenue: "$98K", status: "Active" },
    { merchant: "DigitalGoods", products: "28", revenue: "$76K", status: "Active" },
    { merchant: "CloudServices", products: "19", revenue: "$112K", status: "Active" },
    { merchant: "AppMarket", products: "56", revenue: "$145K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Merchant Manager" subtitle="Merchant management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
