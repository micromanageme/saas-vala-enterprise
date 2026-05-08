import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/export-manager")({
  head: () => ({ meta: [{ title: "Export Manager — SaaS Vala" }, { name: "description", content: "Export management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: exportData, isLoading, error } = useQuery({
    queryKey: ["export-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Export Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Export Manager" subtitle="Export management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Export Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Shipments Sent", value: "150", delta: "+20", up: true },
    { label: "Value Exported", value: "$6.5M", delta: "+$750K", up: true },
    { label: "On-Time Delivery", value: "94%", delta: "+3%", up: true },
    { label: "Customer Satisfaction", value: "4.6/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "shipment", label: "Shipment" },
    { key: "destination", label: "Destination" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { shipment: "EXP-001", destination: "UK", value: "$75K", status: "In Transit" },
    { shipment: "EXP-002", destination: "France", value: "$90K", status: "Delivered" },
    { shipment: "EXP-003", destination: "Canada", value: "$110K", status: "In Transit" },
    { shipment: "EXP-004", destination: "Australia", value: "$85K", status: "Processing" },
    { shipment: "EXP-005", destination: "Brazil", value: "$65K", status: "Delivered" },
  ];

  return (
    <AppShell>
      <ModulePage title="Export Manager" subtitle="Export management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
