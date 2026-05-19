import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/wildlife-protection-officer")({
  head: () => ({ meta: [{ title: "Wildlife Protection Officer — SaaS Vala" }, { name: "description", content: "Wildlife protection workspace" }] }),
  component: Page,
});

function Page() {
  const { data: wildlifeData, isLoading, error, refetch } = useQuery({
    queryKey: ["wildlife-protection-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Wildlife Protection Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Wildlife Protection Officer" subtitle="Wildlife protection workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Wildlife Protection Officer"
          subtitle="Wildlife protection workspace"
          message="We couldn't load Wildlife Protection Officer data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Species Monitored", value: "85", delta: "+8", up: true },
    { label: "Rescues", value: "45", delta: "+5", up: true },
    { label: "Poaching Incidents", value: "5", delta: "-2", up: true },
    { label: "Habitat Health", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "species", label: "Protected Species" },
    { key: "population", label: "Population" },
    { key: "trend", label: "Trend" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { species: "Tiger", population: "450", trend: "Stable", status: "Protected" },
    { species: "Elephant", population: "2,500", trend: "Increasing", status: "Protected" },
    { species: "Rhino", population: "320", trend: "Stable", status: "Protected" },
    { species: "Leopard", population: "850", trend: "Increasing", status: "Protected" },
    { species: "Bear", population: "1,200", trend: "Stable", status: "Protected" },
  ];

  return (
    <AppShell>
      <ModulePage title="Wildlife Protection Officer" subtitle="Wildlife protection workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
