import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/satcom-operations")({
  head: () => ({ meta: [{ title: "SatCom Operations — SaaS Vala" }, { name: "description", content: "Satellite communications operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: satcomData, isLoading, error } = useQuery({
    queryKey: ["satcom-operations-dashboard"],
    queryFn: async () => {
      const response = fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch SatCom Operations data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="SatCom Operations" subtitle="Satellite communications operations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load SatCom Operations data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Satellites Linked", value: "12", delta: "+2", up: true },
    { label: "Bandwidth", value: "50 Gbps", delta: "+5 Gbps", up: true },
    { label: "Link Quality", value: "99%", delta: "+1%", up: true },
    { label: "Coverage", value: "Global", delta: "—", up: true },
  ];

  const columns = [
    { key: "satellite", label: "Satellite" },
    { key: "orbital", label: "Orbital Position" },
    { key: "beams", label: "Active Beams" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { satellite: "SAT-001", orbital: "GEO", beams: "8", status: "Active" },
    { satellite: "SAT-002", orbital: "LEO", beams: "4", status: "Active" },
    { satellite: "SAT-003", orbital: "GEO", beams: "10", status: "Active" },
    { satellite: "SAT-004", orbital: "MEO", beams: "6", status: "Standby" },
    { satellite: "SAT-005", orbital: "GEO", beams: "8", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="SatCom Operations" subtitle="Satellite communications operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
