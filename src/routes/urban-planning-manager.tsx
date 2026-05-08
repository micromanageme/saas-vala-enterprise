import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/urban-planning-manager")({
  head: () => ({ meta: [{ title: "Urban Planning Manager — SaaS Vala" }, { name: "description", content: "Urban planning management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: urbanData, isLoading, error } = useQuery({
    queryKey: ["urban-planning-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Urban Planning Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Urban Planning Manager" subtitle="Urban planning management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Urban Planning Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Projects", value: "18", delta: "+2", up: true },
    { label: "Zoning Requests", value: "45", delta: "+5", up: true },
    { label: "Permits Issued", value: "125", delta: "+15", up: true },
    { label: "Development Area", value: "2.5K acres", delta: "+300 acres", up: true },
  ];

  const columns = [
    { key: "project", label: "Planning Project" },
    { key: "zone", label: "Zone" },
    { key: "budget", label: "Budget" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "Downtown Redevelopment", zone: "Commercial", budget: "$25M", status: "In Progress" },
    { project: "Residential Expansion", zone: "Residential", budget: "$18M", status: "Planning" },
    { project: "Industrial Park", zone: "Industrial", budget: "$30M", status: "Approved" },
    { project: "Green Belt Project", zone: "Recreational", budget: "$8M", status: "Active" },
    { project: "Transport Hub", zone: "Transportation", budget: "$45M", status: "Design" },
  ];

  return (
    <AppShell>
      <ModulePage title="Urban Planning Manager" subtitle="Urban planning management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
