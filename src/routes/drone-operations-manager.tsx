import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/drone-operations-manager")({
  head: () => ({ meta: [{ title: "Drone Operations Manager — SaaS Vala" }, { name: "description", content: "Drone operations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: droneData, isLoading, error } = useQuery({
    queryKey: ["drone-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Drone Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Drone Operations Manager" subtitle="Drone operations management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Drone Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Drones", value: "45", delta: "+5", up: true },
    { label: "Flight Hours", value: "2.5K", delta: "+200", up: true },
    { label: "Missions Completed", value: "380", delta: "+45", up: true },
    { label: "Accident Rate", value: "0.2%", delta: "-0.1%", up: true },
  ];

  const columns = [
    { key: "drone", label: "Drone" },
    { key: "type", label: "Type" },
    { key: "mission", label: "Current Mission" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { drone: "DR-001", type: "Surveillance", mission: "Patrol Sector A", status: "In Flight" },
    { drone: "DR-002", type: "Delivery", mission: "Package Delivery", status: "Landing" },
    { drone: "DR-003", type: "Inspection", mission: "Infrastructure Check", status: "In Flight" },
    { drone: "DR-004", type: "Mapping", mission: "Survey Area B", status: "Charging" },
    { drone: "DR-005", type: "Agriculture", mission: "Crop Monitoring", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="Drone Operations Manager" subtitle="Drone operations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
