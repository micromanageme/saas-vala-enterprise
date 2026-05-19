import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/aviation-manager")({
  head: () => ({ meta: [{ title: "Aviation Manager — SaaS Vala" }, { name: "description", content: "Aviation management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: aviationData, isLoading, error, refetch } = useQuery({
    queryKey: ["aviation-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Aviation Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Aviation Manager" subtitle="Aviation management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Aviation Manager"
          subtitle="Aviation management workspace"
          message="We couldn't load Aviation Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Flights Operated", value: "450", delta: "+25", up: true },
    { label: "Passengers Served", value: "45K", delta: "+3K", up: true },
    { label: "On-Time Performance", value: "92%", delta: "+1%", up: true },
    { label: "Fleet Utilization", value: "85%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "flight", label: "Flight" },
    { key: "destination", label: "Destination" },
    { key: "aircraft", label: "Aircraft" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { flight: "FL-001", destination: "New York", aircraft: "B737", status: "In Flight" },
    { flight: "FL-002", destination: "London", aircraft: "A320", status: "Boarding" },
    { flight: "FL-003", destination: "Tokyo", aircraft: "B777", status: "Scheduled" },
    { flight: "FL-004", destination: "Dubai", aircraft: "A380", status: "Landed" },
    { flight: "FL-005", destination: "Singapore", aircraft: "B787", status: "In Flight" },
  ];

  return (
    <AppShell>
      <ModulePage title="Aviation Manager" subtitle="Aviation management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
