import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/gaming-admin")({
  head: () => ({ meta: [{ title: "Gaming Admin — SaaS Vala" }, { name: "description", content: "Gaming administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: gamingData, isLoading, error } = useQuery({
    queryKey: ["gaming-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Gaming Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Gaming Admin" subtitle="Gaming administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Gaming Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Games", value: "25", delta: "+3", up: true },
    { label: "Players Online", value: "5.2K", delta: "+500", up: true },
    { label: "Server Uptime", value: "99.5%", delta: "+0.2%", up: true },
    { label: "Revenue", value: "$125K", delta: "+$15K", up: true },
  ];

  const columns = [
    { key: "game", label: "Game" },
    { key: "genre", label: "Genre" },
    { key: "players", label: "Online Players" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { game: "Game 001", genre: "RPG", players: "1,200", status: "Online" },
    { game: "Game 002", genre: "FPS", players: "2,500", status: "Online" },
    { game: "Game 003", genre: "Strategy", players: "800", status: "Online" },
    { game: "Game 004", genre: "Sports", players: "450", status: "Maintenance" },
    { game: "Game 005", genre: "Racing", players: "350", status: "Online" },
  ];

  return (
    <AppShell>
      <ModulePage title="Gaming Admin" subtitle="Gaming administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
