import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/laboratory-director")({
  head: () => ({ meta: [{ title: "Laboratory Director — SaaS Vala" }, { name: "description", content: "Laboratory director workspace" }] }),
  component: Page,
});

function Page() {
  const { data: labData, isLoading, error } = useQuery({
    queryKey: ["laboratory-director-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Laboratory Director data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Laboratory Director" subtitle="Laboratory director workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Laboratory Director data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Labs Managed", value: "12", delta: "+2", up: true },
    { label: "Research Projects", value: "45", delta: "+5", up: true },
    { label: "Staff", value: "150", delta: "+15", up: true },
    { label: "Budget Utilization", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "lab", label: "Laboratory" },
    { key: "type", label: "Type" },
    { key: "projects", label: "Active Projects" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { lab: "LAB-001", type: "Clinical", projects: "8", status: "Active" },
    { lab: "LAB-002", type: "Research", projects: "10", status: "Active" },
    { lab: "LAB-003", type: "Quality", projects: "5", status: "Active" },
    { lab: "LAB-004", type: "Development", projects: "7", status: "Active" },
    { lab: "LAB-005", type: "Testing", projects: "6", status: "Maintenance" },
  ];

  return (
    <AppShell>
      <ModulePage title="Laboratory Director" subtitle="Laboratory director workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
