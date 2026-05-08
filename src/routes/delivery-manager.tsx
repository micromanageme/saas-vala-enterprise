import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/delivery-manager")({
  head: () => ({ meta: [{ title: "Delivery Manager — SaaS Vala" }, { name: "description", content: "Delivery management" }] }),
  component: Page,
});

function Page() {
  const { data: deliveryData, isLoading, error } = useQuery({
    queryKey: ["delivery-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Delivery Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Delivery Manager" subtitle="Delivery management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Delivery Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Deliveries Today", value: "45", delta: "+8", up: true },
    { label: "On-Time Rate", value: "94%", delta: "+2%", up: true },
    { label: "Avg Delivery Time", value: "2.5h", delta: "-0.3h", up: true },
    { label: "Returns", value: "3%", delta: "-1%", up: true },
  ];

  const columns = [
    { key: "delivery", label: "Delivery" },
    { key: "destination", label: "Destination" },
    { key: "eta", label: "ETA" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { delivery: "DLV-001234", destination: "New York", eta: "2h", status: "In Transit" },
    { delivery: "DLV-001235", destination: "Los Angeles", eta: "4h", status: "Delivered" },
    { delivery: "DLV-001236", destination: "Chicago", eta: "3h", status: "Processing" },
    { delivery: "DLV-001237", destination: "Houston", eta: "1h", status: "In Transit" },
    { delivery: "DLV-001238", destination: "Miami", eta: "5h", status: "Delivered" },
  ];

  return (
    <AppShell>
      <ModulePage title="Delivery Manager" subtitle="Delivery management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
