import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/mission-commander")({
  head: () => ({ meta: [{ title: "Mission Commander — SaaS Vala" }, { name: "description", content: "Mission command workspace" }] }),
  component: Page,
});

function Page() {
  const { data: missionData, isLoading, error } = useQuery({
    queryKey: ["mission-commander-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Mission Commander data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Mission Commander" subtitle="Mission command workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Mission Commander data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Missions", value: "8", delta: "+1", up: true },
    { label: "Mission Success Rate", value: "92%", delta: "+3%", up: true },
    { label: "Team Members", value: "125", delta: "+5", up: true },
    { label: "Resource Allocation", value: "88%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "mission", label: "Mission" },
    { key: "objective", label: "Objective" },
    { key: "team", label: "Team" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { mission: "MISSION-ALPHA", objective: "Reconnaissance", team: "Team Alpha", status: "In Progress" },
    { mission: "MISSION-BRAVO", objective: "Security", team: "Team Bravo", status: "Active" },
    { mission: "MISSION-CHARLIE", objective: "Rescue", team: "Team Charlie", status: "Planning" },
    { mission: "MISSION-DELTA", objective: "Logistics", team: "Team Delta", status: "Standby" },
    { mission: "MISSION-ECHO", objective: "Training", team: "Team Echo", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Mission Commander" subtitle="Mission command workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
