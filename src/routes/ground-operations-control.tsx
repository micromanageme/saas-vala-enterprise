import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ground-operations-control")({
  head: () => ({ meta: [{ title: "Ground Operations Control — SaaS Vala" }, { name: "description", content: "Ground operations control workspace" }] }),
  component: Page,
});

function Page() {
  const { data: groundData, isLoading, error } = useQuery({
    queryKey: ["ground-operations-control-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Ground Operations Control data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Ground Operations Control" subtitle="Ground operations control workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Ground Operations Control data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Ground Units", value: "45", delta: "+5", up: true },
    { label: "Operations Active", value: "12", delta: "+2", up: true },
    { label: "Terrain Coverage", value: "78%", delta: "+5%", up: true },
    { label: "Support Requests", value: "25", delta: "-3", up: true },
  ];

  const columns = [
    { key: "unit", label: "Ground Unit" },
    { key: "sector", label: "Sector" },
    { key: "personnel", label: "Personnel" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { unit: "GU-ALPHA-01", sector: "Northern", personnel: "120", status: "Deployed" },
    { unit: "GU-BRAVO-02", sector: "Southern", personnel: "95", status: "Active" },
    { unit: "GU-CHARLIE-03", sector: "Eastern", personnel: "110", status: "Deployed" },
    { unit: "GU-DELTA-04", sector: "Western", personnel: "85", status: "Standby" },
    { unit: "GU-ECHO-05", sector: "Central", personnel: "130", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Ground Operations Control" subtitle="Ground operations control workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
