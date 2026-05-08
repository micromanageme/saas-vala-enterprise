import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/space-operations-manager")({
  head: () => ({ meta: [{ title: "Space Operations Manager — SaaS Vala" }, { name: "description", content: "Space operations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: spaceData, isLoading, error } = useQuery({
    queryKey: ["space-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Space Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Space Operations Manager" subtitle="Space operations management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Space Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Missions", value: "8", delta: "+1", up: true },
    { label: "Satellites Tracked", value: "450", delta: "+25", up: true },
    { label: "Mission Success Rate", value: "98%", delta: "+1%", up: true },
    { label: "Telemetry Uptime", value: "99.9%", delta: "+0.1%", up: true },
  ];

  const columns = [
    { key: "mission", label: "Space Mission" },
    { key: "status", label: "Status" },
    { key: "duration", label: "Duration" },
    { key: "priority", label: "Priority" },
  ];

  const rows = [
    { mission: "MISSION-ALPHA", status: "Active", duration: "180 days", priority: "Critical" },
    { mission: "MISSION-BRAVO", status: "Active", duration: "90 days", priority: "High" },
    { mission: "MISSION-CHARLIE", status: "Planning", duration: "30 days", priority: "Medium" },
    { mission: "MISSION-DELTA", status: "Completed", duration: "365 days", priority: "High" },
    { mission: "MISSION-ECHO", status: "Standby", duration: "0 days", priority: "Low" },
  ];

  return (
    <AppShell>
      <ModulePage title="Space Operations Manager" subtitle="Space operations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
