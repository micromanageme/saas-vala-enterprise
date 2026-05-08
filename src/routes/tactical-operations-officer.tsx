import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/tactical-operations-officer")({
  head: () => ({ meta: [{ title: "Tactical Operations Officer — SaaS Vala" }, { name: "description", content: "Tactical operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: tacticalData, isLoading, error } = useQuery({
    queryKey: ["tactical-operations-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Tactical Operations Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Tactical Operations Officer" subtitle="Tactical operations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Tactical Operations Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tactical Units", value: "15", delta: "+2", up: true },
    { label: "Operations Executed", value: "45", delta: "+8", up: true },
    { label: "Success Rate", value: "94%", delta: "+2%", up: true },
    { label: "Response Time", value: "8min", delta: "-2min", up: true },
  ];

  const columns = [
    { key: "unit", label: "Tactical Unit" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
    { key: "availability", label: "Availability" },
  ];

  const rows = [
    { unit: "TAC-01", location: "Sector Alpha", status: "Deployed", availability: "Active" },
    { unit: "TAC-02", location: "Sector Bravo", status: "Standby", availability: "Ready" },
    { unit: "TAC-03", location: "Sector Charlie", status: "Deployed", availability: "Active" },
    { unit: "TAC-04", location: "Sector Delta", status: "Training", availability: "Limited" },
    { unit: "TAC-05", location: "Sector Echo", status: "Standby", availability: "Ready" },
  ];

  return (
    <AppShell>
      <ModulePage title="Tactical Operations Officer" subtitle="Tactical operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
