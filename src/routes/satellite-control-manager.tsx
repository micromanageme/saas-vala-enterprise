import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/satellite-control-manager")({
  head: () => ({ meta: [{ title: "Satellite Control Manager — SaaS Vala" }, { name: "description", content: "Satellite control management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: satelliteData, isLoading, error } = useQuery({
    queryKey: ["satellite-control-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Satellite Control Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Satellite Control Manager" subtitle="Satellite control management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Satellite Control Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Satellites Controlled", value: "25", delta: "+2", up: true },
    { label: "Commands Sent", value: "5.2K", delta: "+500", up: true },
    { label: "Data Received", value: "450 TB", delta: "+50 TB", up: true },
    { label: "Link Availability", value: "99.5%", delta: "+0.2%", up: true },
  ];

  const columns = [
    { key: "satellite", label: "Satellite" },
    { key: "orbit", label: "Orbit Type" },
    { key: "status", label: "Status" },
    { key: "health", label: "Health" },
  ];

  const rows = [
    { satellite: "SAT-001", orbit: "LEO", status: "Active", health: "98%" },
    { satellite: "SAT-002", orbit: "GEO", status: "Active", health: "95%" },
    { satellite: "SAT-003", orbit: "MEO", status: "Active", health: "97%" },
    { satellite: "SAT-004", orbit: "LEO", status: "Standby", health: "92%" },
    { satellite: "SAT-005", orbit: "GEO", status: "Active", health: "99%" },
  ];

  return (
    <AppShell>
      <ModulePage title="Satellite Control Manager" subtitle="Satellite control management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
