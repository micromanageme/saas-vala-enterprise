import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ambulance-operations-manager")({
  head: () => ({ meta: [{ title: "Ambulance Operations Manager — SaaS Vala" }, { name: "description", content: "Ambulance operations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: ambulanceData, isLoading, error } = useQuery({
    queryKey: ["ambulance-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Ambulance Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Ambulance Operations Manager" subtitle="Ambulance operations management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Ambulance Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Ambulances Active", value: "20", delta: "+2", up: true },
    { label: "Trips Today", value: "85", delta: "+10", up: true },
    { label: "Fleet Availability", value: "88%", delta: "+3%", up: true },
    { label: "On-Time Response", value: "94%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "ambulance", label: "Ambulance" },
    { key: "location", label: "Current Location" },
    { key: "crew", label: "Crew" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { ambulance: "AMB-001", location: "Downtown", crew: "3", status: "Available" },
    { ambulance: "AMB-002", location: "North Zone", crew: "2", status: "On Call" },
    { ambulance: "AMB-003", location: "South Zone", crew: "3", status: "In Transit" },
    { ambulance: "AMB-004", location: "East Zone", crew: "2", status: "Available" },
    { ambulance: "AMB-005", location: "West Zone", crew: "3", status: "Maintenance" },
  ];

  return (
    <AppShell>
      <ModulePage title="Ambulance Operations Manager" subtitle="Ambulance operations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
