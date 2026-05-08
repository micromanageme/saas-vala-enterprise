import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/gym-manager")({
  head: () => ({ meta: [{ title: "Gym Manager — SaaS Vala" }, { name: "description", content: "Gym management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: gymData, isLoading, error } = useQuery({
    queryKey: ["gym-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Gym Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Gym Manager" subtitle="Gym management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Gym Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Members Active", value: "850", delta: "+50", up: true },
    { label: "Daily Visits", value: "250", delta: "+30", up: true },
    { label: "Equipment Utilization", value: "75%", delta: "+5%", up: true },
    { label: "Retention Rate", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "equipment", label: "Equipment" },
    { key: "type", label: "Type" },
    { key: "usage", label: "Daily Usage" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { equipment: "Treadmills", type: "Cardio", usage: "80%", status: "Available" },
    { equipment: "Weights", type: "Strength", usage: "90%", status: "Available" },
    { equipment: "Bikes", type: "Cardio", usage: "70%", status: "Available" },
    { equipment: "Ellipticals", type: "Cardio", usage: "65%", status: "Maintenance" },
    { equipment: "Cable Machines", type: "Strength", usage: "85%", status: "Available" },
  ];

  return (
    <AppShell>
      <ModulePage title="Gym Manager" subtitle="Gym management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
