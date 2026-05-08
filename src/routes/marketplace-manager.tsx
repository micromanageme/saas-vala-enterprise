import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/marketplace-manager")({
  head: () => ({ meta: [{ title: "Marketplace Manager — SaaS Vala" }, { name: "description", content: "Marketplace operations management" }] }),
  component: Page,
});

function Page() {
  const { data: mpData, isLoading, error } = useQuery({
    queryKey: ["marketplace-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Marketplace Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Marketplace Manager" subtitle="Marketplace operations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Marketplace Manager data</div>
      </AppShell>
    );
  }

  const data = mpData?.analytics?.marketplace;
  const kpis = data ? [
    { label: "Total Vendors", value: data.totalVendors?.toLocaleString() || "0", delta: "+12%", up: true },
    { label: "Active Products", value: "3,456", delta: "+18%", up: true },
    { label: "GMV", value: `$${(data.totalRevenue / 1000000).toFixed(2)}M`, delta: "+22%", up: true },
    { label: "Vendor Satisfaction", value: "4.4/5", delta: "+0.2", up: true },
  ] : [];

  const columns = [
    { key: "vendor", label: "Vendor" },
    { key: "products", label: "Products" },
    { key: "revenue", label: "Revenue" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { vendor: "TechStore Inc", products: "45", revenue: "$125K", status: "Active" },
    { vendor: "SoftwareHub", products: "32", revenue: "$98K", status: "Active" },
    { vendor: "DigitalGoods", products: "28", revenue: "$76K", status: "Active" },
    { vendor: "CloudServices", products: "19", revenue: "$112K", status: "Active" },
    { vendor: "AppMarket", products: "56", revenue: "$145K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Marketplace Manager" subtitle="Marketplace operations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
