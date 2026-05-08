import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/supply-chain-manager")({
  head: () => ({ meta: [{ title: "Supply Chain Manager — SaaS Vala" }, { name: "description", content: "Supply chain management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: supplyData, isLoading, error } = useQuery({
    queryKey: ["supply-chain-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Supply Chain Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Supply Chain Manager" subtitle="Supply chain management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Supply Chain Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Suppliers Managed", value: "85", delta: "+8", up: true },
    { label: "On-Time Delivery", value: "94%", delta: "+2%", up: true },
    { label: "Inventory Turnover", value: "8.5", delta: "+0.5", up: true },
    { label: "Cost Savings", value: "$500K", delta: "+$50K", up: true },
  ];

  const columns = [
    { key: "supplier", label: "Supplier" },
    { key: "category", label: "Category" },
    { key: "performance", label: "Performance" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { supplier: "SUP-001", category: "Raw Materials", performance: "95%", status: "Active" },
    { supplier: "SUP-002", category: "Components", performance: "88%", status: "Active" },
    { supplier: "SUP-003", category: "Logistics", performance: "92%", status: "Active" },
    { supplier: "SUP-004", category: "Packaging", performance: "85%", status: "Warning" },
    { supplier: "SUP-005", category: "Raw Materials", performance: "97%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Supply Chain Manager" subtitle="Supply chain management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
