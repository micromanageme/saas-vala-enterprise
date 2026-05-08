import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/tournament-manager")({
  head: () => ({ meta: [{ title: "Tournament Manager — SaaS Vala" }, { name: "description", content: "Tournament management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: tournamentData, isLoading, error } = useQuery({
    queryKey: ["tournament-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Tournament Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Tournament Manager" subtitle="Tournament management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Tournament Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tournaments Active", value: "8", delta: "+2", up: true },
    { label: "Teams Participating", value: "125", delta: "+15", up: true },
    { label: "Matches Scheduled", value: "250", delta: "+30", up: true },
    { label: "Revenue", value: "$125K", delta: "+$15K", up: true },
  ];

  const columns = [
    { key: "tournament", label: "Tournament" },
    { key: "sport", label: "Sport" },
    { key: "teams", label: "Teams" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { tournament: "CHAMP-2024", sport: "Basketball", teams: "16", status: "In Progress" },
    { tournament: "CUP-2024", sport: "Football", teams: "32", status: "In Progress" },
    { tournament: "OPEN-2024", sport: "Tennis", teams: "64", status: "Registration" },
    { tournament: "SERIES-2024", sport: "Cricket", teams: "8", status: "Completed" },
    { tournament: "LEAGUE-2024", sport: "Swimming", teams: "20", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Tournament Manager" subtitle="Tournament management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
