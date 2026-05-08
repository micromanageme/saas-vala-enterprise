import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/system-dna-analyst")({
  head: () => ({ meta: [{ title: "System DNA Analyst — SaaS Vala" }, { name: "description", content: "System DNA analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: dnaData, isLoading, error } = useQuery({
    queryKey: ["system-dna-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch System DNA Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="System DNA Analyst" subtitle="System DNA analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load System DNA Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Components Profiled", value: "5.2K", delta: "+500", up: true },
    { label: "Dependencies Mapped", value: "12.5K", delta: "+1K", up: true },
    { label: "Coverage", value: "95%", delta: "+2%", up: true },
    { label: "Analysis Depth", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "component", label: "System Component" },
    { key: "layer", label: "Layer" },
    { key: "complexity", label: "Complexity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { component: "CMP-001", layer: "Application", complexity: "High", status: "Analyzed" },
    { component: "CMP-002", layer: "Service", complexity: "Medium", status: "Analyzed" },
    { component: "CMP-003", layer: "Data", complexity: "High", status: "In Progress" },
    { component: "CMP-004", layer: "Infrastructure", complexity: "Low", status: "Analyzed" },
    { component: "CMP-005", layer: "Security", complexity: "High", status: "Analyzed" },
  ];

  return (
    <AppShell>
      <ModulePage title="System DNA Analyst" subtitle="System DNA analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
