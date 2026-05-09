import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventory — SaaS Vala" }, { name: "description", content: "Stock, warehouses & moves" }] }),
  component: Page,
});

function Page() {
  const { data: inventoryData, isLoading, error } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const response = await fetch("/api/inventory?type=all");
      if (!response.ok) throw new Error("Failed to fetch Inventory data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Inventory" subtitle="Stock, warehouses & moves" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Inventory data</div>
      </AppShell>
    );
  }

  const data = inventoryData?.data;
  const kpis = data?.kpis ? [
    { label: "Total Products", value: data.kpis.totalProducts.toString(), delta: `+${data.kpis.totalProductsDelta}`, up: data.kpis.totalProductsDelta > 0 },
    { label: "Total Stock", value: data.kpis.totalStock.toLocaleString(), delta: `+${data.kpis.totalStockDelta}%`, up: data.kpis.totalStockDelta > 0 },
    { label: "Low Stock", value: data.kpis.lowStock.toString(), delta: `${data.kpis.lowStockDelta}`, up: data.kpis.lowStockDelta < 0 },
    { label: "Value", value: `$${(data.kpis.value / 1000000).toFixed(2)}M`, delta: `+${data.kpis.valueDelta}%`, up: data.kpis.valueDelta > 0 }
  ] : [];

  const columns = [{ key: "name", label: "Product" }, { key: "sku", label: "SKU" }, { key: "stock", label: "Stock" }, { key: "status", label: "Status" }];
  const rows = data?.products?.map((product: any) => ({
    name: product.name,
    sku: product.sku,
    stock: product.stock.toString(),
    status: product.status
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Inventory" subtitle="Stock, warehouses & moves" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
