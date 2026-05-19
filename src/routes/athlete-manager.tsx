import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/athlete-manager")({
  head: () => ({ meta: [{ title: "Athlete Manager — SaaS Vala" }, { name: "description", content: "Athlete management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: athleteData, isLoading, error, refetch } = useQuery({
    queryKey: ["athlete-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Athlete Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Athlete Manager" subtitle="Athlete management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Athlete Manager"
          subtitle="Athlete management workspace"
          message="We couldn't load Athlete Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Athletes Managed", value: "85", delta: "+10", up: true },
    { label: "Training Hours", value: "2.5K", delta: "+300", up: true },
    { label: "Performance Score", value: "88%", delta: "+3%", up: true },
    { label: "Injury Rate", value: "5%", delta: "-2%", up: true },
  ];

  const columns = [
    { key: "athlete", label: "Athlete" },
    { key: "sport", label: "Sport" },
    { key: "level", label: "Level" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { athlete: "John Smith", sport: "Basketball", level: "Professional", status: "Active" },
    { athlete: "Sarah Johnson", sport: "Swimming", level: "Elite", status: "Active" },
    { athlete: "Mike Brown", sport: "Football", level: "Amateur", status: "Active" },
    { athlete: "Emily Davis", sport: "Tennis", level: "Professional", status: "Injured" },
    { athlete: "Alex Wilson", sport: "Athletics", level: "Elite", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Athlete Manager" subtitle="Athlete management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
