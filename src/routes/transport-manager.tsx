import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/transport-manager")({
  head: () => ({ meta: [{ title: "Transport Manager — SaaS Vala" }, { name: "description", content: "Transport management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: transportData, isLoading, error } = useQuery({
    queryKey: ["transport-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Transport Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Transport Manager" subtitle="Transport management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Transport Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Vehicles in Fleet", value: "250", delta: "+15", up: true },
    { label: "Trips Completed", value: "1.2K", delta: "+150", up: true },
    { label: "On-Time Rate", value: "94%", delta: "+2%", up: true },
    { label: "Fuel Efficiency", value: "8.5 MPG", delta: "+0.3", up: true },
  ];

  const columns = [
    { key: "vehicle", label: "Vehicle" },
    { key: "route", label: "Route" },
    { key: "status", label: "Status" },
    { key: "driver", label: "Driver" },
  ];

  const rows = [
    { vehicle: "VH-001", route: "Route A", status: "In Transit", driver: "John Smith" },
    { vehicle: "VH-002", route: "Route B", status: "Available", driver: "Sarah Johnson" },
    { vehicle: "VH-003", route: "Route C", status: "Maintenance", driver: "Mike Brown" },
    { vehicle: "VH-004", route: "Route D", status: "In Transit", driver: "Emily Davis" },
    { vehicle: "VH-005", route: "Route E", status: "Available", driver: "Alex Wilson" },
  ];

  return (
    <AppShell>
      <ModulePage title="Transport Manager" subtitle="Transport management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
