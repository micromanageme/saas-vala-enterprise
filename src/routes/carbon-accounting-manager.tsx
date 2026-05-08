import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/carbon-accounting-manager")({
  head: () => ({ meta: [{ title: "Carbon Accounting Manager — SaaS Vala" }, { name: "description", content: "Carbon accounting management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: carbonData, isLoading, error } = useQuery({
    queryKey: ["carbon-accounting-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Carbon Accounting Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Carbon Accounting Manager" subtitle="Carbon accounting management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Carbon Accounting Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Carbon Credits", value: "5.2K", delta: "+300", up: true },
    { label: "Emissions Tracked", value: "125 tons", delta: "+15 tons", up: false },
    { label: "Offset Projects", value: "18", delta: "+2", up: true },
    { label: "Compliance Status", value: "Compliant", delta: "—", up: true },
  ];

  const columns = [
    { key: "project", label: "Carbon Project" },
    { key: "type", label: "Type" },
    { key: "credits", label: "Credits Generated" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "Reforestation A", type: "Offset", credits: "500", status: "Active" },
    { project: "Renewable Energy B", type: "Offset", credits: "800", status: "Active" },
    { project: "Energy Efficiency C", type: "Reduction", credits: "300", status: "In Progress" },
    { project: "Methane Capture D", type: "Offset", credits: "450", status: "Planning" },
    { project: "Carbon Capture E", type: "Reduction", credits: "600", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Carbon Accounting Manager" subtitle="Carbon accounting management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
