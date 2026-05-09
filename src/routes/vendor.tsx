import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/vendor")({
  head: () => ({ meta: [{ title: "Vendor Dashboard — SaaS Vala" }, { name: "description", content: "Vendor portal" }] }),
  component: Page,
});

function Page() {
  const { data: vendorData, isLoading, error } = useQuery({
    queryKey: ["vendor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Vendor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Vendor Dashboard" subtitle="Vendor portal" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Vendor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Products Listed", value: "12", delta: "+2", up: true },
    { label: "Total Sales", value: "$12.5K", delta: "+18%", up: true },
    { label: "Pending Orders", value: "8", delta: "-2", up: true },
    { label: "Rating", value: "4.5/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "product", label: "Product" },
    { key: "sales", label: "Sales" },
    { key: "revenue", label: "Revenue" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { product: "Enterprise Plugin", sales: "45", revenue: "$4.5K", status: "Active" },
    { product: "Analytics Extension", sales: "32", revenue: "$3.2K", status: "Active" },
    { product: "Custom Theme", sales: "28", revenue: "$2.8K", status: "Active" },
    { product: "Integration Tool", sales: "18", revenue: "$1.8K", status: "Active" },
    { product: "Training Material", sales: "12", revenue: "$0.2K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Vendor Dashboard" subtitle="Vendor portal" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
