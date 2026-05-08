import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/warehouse-manager")({
  head: () => ({ meta: [{ title: "Warehouse Manager — SaaS Vala" }, { name: "description", content: "Warehouse management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: warehouseData, isLoading, error } = useQuery({
    queryKey: ["warehouse-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Warehouse Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Warehouse Manager" subtitle="Warehouse management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Warehouse Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Inventory Items", value: "45.2K", delta: "+2.5K", up: true },
    { label: "Capacity Utilization", value: "78%", delta: "+5%", up: false },
    { label: "Orders Processed", value: "1.2K", delta: "+150", up: true },
    { label: "Pick Accuracy", value: "99.5%", delta: "+0.2%", up: true },
  ];

  const columns = [
    { key: "zone", label: "Warehouse Zone" },
    { key: "capacity", label: "Capacity" },
    { key: "items", label: "Items" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { zone: "Zone A - Receiving", capacity: "10K", items: "8.5K", status: "Active" },
    { zone: "Zone B - Storage", capacity: "15K", items: "12K", status: "Active" },
    { zone: "Zone C - Picking", capacity: "8K", items: "6.5K", status: "Active" },
    { zone: "Zone D - Packing", capacity: "5K", items: "4.2K", status: "Active" },
    { zone: "Zone E - Shipping", capacity: "7K", items: "5.8K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Warehouse Manager" subtitle="Warehouse management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
