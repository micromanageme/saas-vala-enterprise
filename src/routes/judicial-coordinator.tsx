import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/judicial-coordinator")({
  head: () => ({ meta: [{ title: "Judicial Coordinator — SaaS Vala" }, { name: "description", content: "Judicial coordination workspace" }] }),
  component: Page,
});

function Page() {
  const { data: judicialData, isLoading, error } = useQuery({
    queryKey: ["judicial-coordinator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Judicial Coordinator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Judicial Coordinator" subtitle="Judicial coordination workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Judicial Coordinator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Judges", value: "12", delta: "0", up: true },
    { label: "Coordinated Cases", value: "85", delta: "+8", up: true },
    { label: "Court Efficiency", value: "92%", delta: "+2%", up: true },
    { label: "Resource Allocation", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "judge", label: "Judge" },
    { key: "court", label: "Court" },
    { key: "caseload", label: "Caseload" },
    { key: "availability", label: "Availability" },
  ];

  const rows = [
    { judge: "Hon. J. Smith", court: "Superior Court", caseload: "45", availability: "Available" },
    { judge: "Hon. S. Johnson", court: "District Court", caseload: "38", availability: "Available" },
    { judge: "Hon. M. Brown", court: "Family Court", caseload: "52", availability: "Busy" },
    { judge: "Hon. E. Davis", court: "Criminal Court", caseload: "35", availability: "Available" },
    { judge: "Hon. A. Wilson", court: "Civil Court", caseload: "48", availability: "Busy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Judicial Coordinator" subtitle="Judicial coordination workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
