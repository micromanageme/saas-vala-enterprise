import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/rescue-operations-manager")({
  head: () => ({ meta: [{ title: "Rescue Operations Manager — SaaS Vala" }, { name: "description", content: "Rescue operations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: rescueData, isLoading, error } = useQuery({
    queryKey: ["rescue-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Rescue Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Rescue Operations Manager" subtitle="Rescue operations management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Rescue Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Rescues Completed", value: "85", delta: "+10", up: true },
    { label: "Lives Saved", value: "150", delta: "+20", up: true },
    { label: "Team Efficiency", value: "94%", delta: "+2%", up: true },
    { label: "Equipment Status", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "operation", label: "Rescue Operation" },
    { key: "type", label: "Type" },
    { key: "team", label: "Team" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { operation: "RES-001", type: "Water Rescue", team: "Team Alpha", status: "Completed" },
    { operation: "RES-002", type: "Mountain Rescue", team: "Team Bravo", status: "Active" },
    { operation: "RES-003", type: "Urban Search", team: "Team Charlie", status: "Active" },
    { operation: "RES-004", type: "Fire Rescue", team: "Team Delta", status: "Completed" },
    { operation: "RES-005", type: "Wilderness", team: "Team Echo", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="Rescue Operations Manager" subtitle="Rescue operations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
