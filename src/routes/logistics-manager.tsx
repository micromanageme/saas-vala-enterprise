import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/logistics-manager")({
  head: () => ({ meta: [{ title: "Logistics Manager — SaaS Vala" }, { name: "description", content: "Logistics management" }] }),
  component: Page,
});

function Page() {
  const { data: logisticsData, isLoading, error, refetch } = useQuery({
    queryKey: ["logistics-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Logistics Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Logistics Manager" subtitle="Logistics management" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Logistics Manager"
          subtitle="Logistics management"
          message="We couldn't load Logistics Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Shipments in Transit", value: "45", delta: "+5", up: true },
    { label: "On-Time Delivery", value: "94%", delta: "+2%", up: true },
    { label: "Shipping Cost", value: "$12.5K", delta: "-5%", up: true },
    { label: "Returns", value: "3%", delta: "-1%", up: true },
  ];

  const columns = [
    { key: "shipment", label: "Shipment" },
    { key: "destination", label: "Destination" },
    { key: "status", label: "Status" },
    { key: "eta", label: "ETA" },
  ];

  const rows = [
    { shipment: "SHP-001234", destination: "New York", status: "In Transit", eta: "2 days" },
    { shipment: "SHP-001235", destination: "Los Angeles", status: "Delivered", eta: "—" },
    { shipment: "SHP-001236", destination: "Chicago", status: "Processing", eta: "3 days" },
    { shipment: "SHP-001237", destination: "Houston", status: "In Transit", eta: "1 day" },
    { shipment: "SHP-001238", destination: "Miami", status: "Delivered", eta: "—" },
  ];

  return (
    <AppShell>
      <ModulePage title="Logistics Manager" subtitle="Logistics management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
