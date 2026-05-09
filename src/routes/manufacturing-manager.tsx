import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/manufacturing-manager")({
  head: () => ({ meta: [{ title: "Manufacturing Manager — SaaS Vala" }, { name: "description", content: "Manufacturing operations management" }] }),
  component: Page,
});

function Page() {
  const { data: mfgData, isLoading, error } = useQuery({
    queryKey: ["manufacturing-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Manufacturing Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Manufacturing Manager" subtitle="Manufacturing operations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Manufacturing Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Orders", value: "45", delta: "+8", up: true },
    { label: "Production Rate", value: "92%", delta: "+3%", up: true },
    { label: "Quality Score", value: "98.5%", delta: "+0.5%", up: true },
    { label: "On-Time Delivery", value: "94%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "order", label: "Order" },
    { key: "product", label: "Product" },
    { key: "quantity", label: "Quantity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { order: "ORD-001234", product: "Enterprise Bundle", quantity: "250", status: "In Production" },
    { order: "ORD-001235", product: "Pro Bundle", quantity: "180", status: "Quality Check" },
    { order: "ORD-001236", product: "Basic Bundle", quantity: "320", status: "Ready" },
    { order: "ORD-001237", product: "Custom Package", quantity: "95", status: "In Production" },
    { order: "ORD-001238", product: "Training Kit", quantity: "150", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="Manufacturing Manager" subtitle="Manufacturing operations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
