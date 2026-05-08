import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/research-manager")({
  head: () => ({ meta: [{ title: "Research Manager — SaaS Vala" }, { name: "description", content: "Research management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: researchData, isLoading, error } = useQuery({
    queryKey: ["research-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Research Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Research Manager" subtitle="Research management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Research Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Projects", value: "25", delta: "+3", up: true },
    { label: "Researchers", value: "85", delta: "+5", up: true },
    { label: "Publications", value: "45", delta: "+8", up: true },
    { label: "Funding Secured", value: "$5.8M", delta: "+$800K", up: true },
  ];

  const columns = [
    { key: "project", label: "Research Project" },
    { key: "team", label: "Team Size" },
    { key: "budget", label: "Budget" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "AI in Healthcare", team: "12", budget: "$1.2M", status: "Active" },
    { project: "Renewable Energy", team: "8", budget: "$800K", status: "Active" },
    { project: "Climate Change", team: "15", budget: "$1.5M", status: "In Progress" },
    { project: "Quantum Computing", team: "6", budget: "$2M", status: "Planning" },
    { project: "Biotechnology", team: "10", budget: "$1.1M", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Research Manager" subtitle="Research management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
