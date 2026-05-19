import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/fleet-manager")({
  head: () => ({ meta: [{ title: "Fleet Manager — SaaS Vala" }, { name: "description", content: "Fleet management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: fleetData, isLoading, error, refetch } = useQuery({
    queryKey: ["fleet-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Fleet Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Fleet Manager" subtitle="Fleet management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Fleet Manager"
          subtitle="Fleet management workspace"
          message="We couldn't load Fleet Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total Vehicles", value: "350", delta: "+20", up: true },
    { label: "Fleet Utilization", value: "82%", delta: "+3%", up: true },
    { label: "Maintenance Cost", value: "$125K", delta: "-$10K", up: true },
    { label: "Fuel Efficiency", value: "28 MPG", delta: "+1.5", up: true },
  ];

  const columns = [
    { key: "vehicle", label: "Vehicle" },
    { key: "category", label: "Category" },
    { key: "driver", label: "Assigned Driver" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { vehicle: "VH-001", category: "Truck", driver: "John Smith", status: "Active" },
    { vehicle: "VH-002", category: "Van", driver: "Sarah Johnson", status: "Active" },
    { vehicle: "VH-003", category: "Car", driver: "Mike Brown", status: "Maintenance" },
    { vehicle: "VH-004", category: "Truck", driver: "Emily Davis", status: "Active" },
    { vehicle: "VH-005", category: "Van", driver: "Alex Wilson", status: "Available" },
  ];

  return (
    <AppShell>
      <ModulePage title="Fleet Manager" subtitle="Fleet management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
