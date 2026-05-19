import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/tourism-manager")({
  head: () => ({ meta: [{ title: "Tourism Manager — SaaS Vala" }, { name: "description", content: "Tourism management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: tourismData, isLoading, error, refetch } = useQuery({
    queryKey: ["tourism-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Tourism Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Tourism Manager" subtitle="Tourism management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Tourism Manager"
          subtitle="Tourism management workspace"
          message="We couldn't load Tourism Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tourists Served", value: "2.5K", delta: "+300", up: true },
    { label: "Tours Booked", value: "450", delta: "+50", up: true },
    { label: "Destination Rating", value: "4.8/5", delta: "+0.1", up: true },
    { label: "Revenue", value: "$450K", delta: "+$50K", up: true },
  ];

  const columns = [
    { key: "destination", label: "Tour Destination" },
    { key: "type", label: "Type" },
    { key: "visitors", label: "Monthly Visitors" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { destination: "Historic City Tour", type: "Cultural", visitors: "500", status: "Active" },
    { destination: "Nature Trail", type: "Adventure", visitors: "350", status: "Active" },
    { destination: "Beach Resort", type: "Leisure", visitors: "600", status: "Active" },
    { destination: "Mountain Hiking", type: "Adventure", visitors: "250", status: "Seasonal" },
    { destination: "City Sightseeing", type: "Cultural", visitors: "450", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Tourism Manager" subtitle="Tourism management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
