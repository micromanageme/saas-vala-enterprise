import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/distribution-manager")({
  head: () => ({ meta: [{ title: "Distribution Manager — SaaS Vala" }, { name: "description", content: "Distribution management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: distributionData, isLoading, error } = useQuery({
    queryKey: ["distribution-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Distribution Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Distribution Manager" subtitle="Distribution management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Distribution Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Warehouses", value: "12", delta: "+1", up: true },
    { label: "Orders Fulfilled", value: "2.5K", delta: "+300", up: true },
    { label: "Delivery Time", value: "2 days", delta: "-0.5 days", up: true },
    { label: "Accuracy", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "warehouse", label: "Distribution Center" },
    { key: "region", label: "Region" },
    { key: "throughput", label: "Daily Orders" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { warehouse: "DC-001", region: "North", throughput: "500", status: "Active" },
    { warehouse: "DC-002", region: "South", throughput: "450", status: "Active" },
    { warehouse: "DC-003", region: "East", throughput: "400", status: "Active" },
    { warehouse: "DC-004", region: "West", throughput: "350", status: "Maintenance" },
    { warehouse: "DC-005", region: "Central", throughput: "600", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Distribution Manager" subtitle="Distribution management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
