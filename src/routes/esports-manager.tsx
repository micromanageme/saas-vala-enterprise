import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/esports-manager")({
  head: () => ({ meta: [{ title: "Esports Manager — SaaS Vala" }, { name: "description", content: "Esports management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: esportsData, isLoading, error } = useQuery({
    queryKey: ["esports-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Esports Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Esports Manager" subtitle="Esports management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Esports Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Teams Managed", value: "12", delta: "+2", up: true },
    { label: "Players", value: "60", delta: "+8", up: true },
    { label: "Tournaments Won", value: "8", delta: "+1", up: true },
    { label: "Prize Money", value: "$250K", delta: "+$50K", up: true },
  ];

  const columns = [
    { key: "team", label: "Esports Team" },
    { key: "game", label: "Game" },
    { key: "players", label: "Players" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { team: "TEAM-ALPHA", game: "League of Legends", players: "5", status: "Active" },
    { team: "TEAM-BRAVO", game: "CS:GO", players: "5", status: "Active" },
    { team: "TEAM-CHARLIE", game: "Dota 2", players: "5", status: "Active" },
    { team: "TEAM-DELTA", game: "Valorant", players: "5", status: "Standby" },
    { team: "TEAM-ECHO", game: "Fortnite", players: "4", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Esports Manager" subtitle="Esports management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
