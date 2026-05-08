import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/air-defense-operations")({
  head: () => ({ meta: [{ title: "Air Defense Operations — SaaS Vala" }, { name: "description", content: "Air defense operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: airDefenseData, isLoading, error } = useQuery({
    queryKey: ["air-defense-operations-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Air Defense Operations data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Air Defense Operations" subtitle="Air defense operations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Air Defense Operations data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Aircraft Monitored", value: "125", delta: "+15", up: true },
    { label: "Interceptions", value: "8", delta: "+2", up: true },
    { label: "Airspace Coverage", value: "100%", delta: "—", up: true },
    { label: "Alert Status", value: "Yellow", delta: "—", up: true },
  ];

  const columns = [
    { key: "sector", label: "Air Defense Sector" },
    { key: "radar", label: "Radar Status" },
    { key: "aircraft", label: "Aircraft Detected" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { sector: "ADS-NORTH", radar: "Operational", aircraft: "25", status: "Active" },
    { sector: "ADS-SOUTH", radar: "Operational", aircraft: "18", status: "Active" },
    { sector: "ADS-EAST", radar: "Operational", aircraft: "32", status: "Active" },
    { sector: "ADS-WEST", radar: "Maintenance", aircraft: "22", status: "Limited" },
    { sector: "ADS-CENTRAL", radar: "Operational", aircraft: "28", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Air Defense Operations" subtitle="Air defense operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
