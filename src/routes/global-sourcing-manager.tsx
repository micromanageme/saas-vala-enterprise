import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/global-sourcing-manager")({
  head: () => ({ meta: [{ title: "Global Sourcing Manager — SaaS Vala" }, { name: "description", content: "Global sourcing management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: sourcingData, isLoading, error } = useQuery({
    queryKey: ["global-sourcing-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Global Sourcing Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Global Sourcing Manager" subtitle="Global sourcing management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Global Sourcing Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Countries Sourced", value: "25", delta: "+3", up: true },
    { label: "Cost Reduction", value: "15%", delta: "+2%", up: true },
    { label: "Supplier Diversity", value: "40%", delta: "+5%", up: true },
    { label: "Risk Mitigation", value: "85%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "region", label: "Sourcing Region" },
    { key: "category", label: "Category" },
    { key: "suppliers", label: "Active Suppliers" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { region: "Asia Pacific", category: "Electronics", suppliers: "15", status: "Active" },
    { region: "Europe", category: "Automotive", suppliers: "10", status: "Active" },
    { region: "North America", category: "Textiles", suppliers: "8", status: "Active" },
    { region: "Latin America", category: "Agriculture", suppliers: "6", status: "Developing" },
    { region: "Middle East", category: "Chemicals", suppliers: "5", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Global Sourcing Manager" subtitle="Global sourcing management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
