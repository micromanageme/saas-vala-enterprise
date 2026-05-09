import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/inventory-manager")({
  head: () => ({ meta: [{ title: "Inventory Manager — SaaS Vala" }, { name: "description", content: "Inventory operations management" }] }),
  component: Page,
});

function Page() {
  const { data: invData, isLoading, error } = useQuery({
    queryKey: ["inventory-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Inventory Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Inventory Manager" subtitle="Inventory operations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Inventory Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total SKUs", value: "2,345", delta: "+5%", up: true },
    { label: "Stock Value", value: "$1.2M", delta: "+8%", up: true },
    { label: "Low Stock Items", value: "23", delta: "-5", up: true },
    { label: "Turnover Rate", value: "4.2x", delta: "+0.3", up: true },
  ];

  const columns = [
    { key: "product", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "quantity", label: "Quantity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { product: "Enterprise License", sku: "LIC-ENT-001", quantity: "1,200", status: "In Stock" },
    { product: "Pro License", sku: "LIC-PRO-001", quantity: "856", status: "In Stock" },
    { product: "Basic License", sku: "LIC-BAS-001", quantity: "45", status: "Low Stock" },
    { product: "Support Package", sku: "SUP-STD-001", quantity: "234", status: "In Stock" },
    { product: "Training Bundle", sku: "TRN-ALL-001", quantity: "12", status: "Low Stock" },
  ];

  return (
    <AppShell>
      <ModulePage title="Inventory Manager" subtitle="Inventory operations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
