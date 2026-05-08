import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/internal-tooling-manager")({
  head: () => ({ meta: [{ title: "Internal Tooling Manager — SaaS Vala" }, { name: "description", content: "Internal tooling management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: toolingData, isLoading, error } = useQuery({
    queryKey: ["internal-tooling-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Internal Tooling Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Internal Tooling Manager" subtitle="Internal tooling management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Internal Tooling Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tools Managed", value: "45", delta: "+5", up: true },
    { label: "Adoption Rate", value: "85%", delta: "+3%", up: true },
    { label: "Incidents", value: "2", delta: "-1", up: true },
    { label: "Satisfaction", value: "4.5/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "tool", label: "Internal Tool" },
    { key: "category", label: "Category" },
    { key: "users", label: "Active Users" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { tool: "TOOL-001", category: "Development", users: "150", status: "Active" },
    { tool: "TOOL-002", category: "Operations", users: "100", status: "Active" },
    { tool: "TOOL-003", category: "Analytics", users: "75", status: "Active" },
    { tool: "TOOL-004", category: "Testing", users: "50", status: "Maintenance" },
    { tool: "TOOL-005", category: "Documentation", users: "80", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Internal Tooling Manager" subtitle="Internal tooling management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
