import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/route-manager")({
  head: () => ({ meta: [{ title: "Route Manager — SaaS Vala" }, { name: "description", content: "Route management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: routeData, isLoading, error } = useQuery({
    queryKey: ["route-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Route Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Route Manager" subtitle="Route management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Route Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Routes Managed", value: "25", delta: "+3", up: true },
    { label: "Optimization", value: "85%", delta: "+5%", up: true },
    { label: "Fuel Savings", value: "12%", delta: "+2%", up: true },
    { label: "On-Time Delivery", value: "94%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "route", label: "Route" },
    { key: "stops", label: "Stops" },
    { key: "distance", label: "Distance (km)" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { route: "RTE-001", stops: "15", distance: "120", status: "Active" },
    { route: "RTE-002", stops: "20", distance: "180", status: "Active" },
    { route: "RTE-003", stops: "10", distance: "80", status: "Active" },
    { route: "RTE-004", stops: "25", distance: "250", status: "Optimizing" },
    { route: "RTE-005", stops: "12", distance: "100", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Route Manager" subtitle="Route management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
