import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/marine-manager")({
  head: () => ({ meta: [{ title: "Marine Manager — SaaS Vala" }, { name: "description", content: "Marine management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: marineData, isLoading, error } = useQuery({
    queryKey: ["marine-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Marine Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Marine Manager" subtitle="Marine management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Marine Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Vessels Managed", value: "65", delta: "+5", up: true },
    { label: "Cargo Tonnage", value: "450K", delta: "+30K", up: true },
    { label: "Safety Incidents", value: "0", delta: "0", up: true },
    { label: "Fleet Availability", value: "92%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "vessel", label: "Marine Vessel" },
    { key: "type", label: "Type" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { vessel: "MV-001", type: "Cargo", location: "Pacific", status: "In Transit" },
    { vessel: "MV-002", type: "Tanker", location: "Atlantic", status: "Loading" },
    { vessel: "MV-003", type: "Container", location: "Indian Ocean", status: "Unloading" },
    { vessel: "MV-004", type: "Passenger", location: "Mediterranean", status: "Docked" },
    { vessel: "MV-005", type: "Supply", location: "North Sea", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Marine Manager" subtitle="Marine management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
