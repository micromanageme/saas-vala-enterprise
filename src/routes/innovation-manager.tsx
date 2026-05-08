import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/innovation-manager")({
  head: () => ({ meta: [{ title: "Innovation Manager — SaaS Vala" }, { name: "description", content: "Innovation management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: innovationData, isLoading, error } = useQuery({
    queryKey: ["innovation-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Innovation Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Innovation Manager" subtitle="Innovation management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Innovation Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Projects", value: "12", delta: "+2", up: true },
    { label: "Ideas Submitted", value: "45", delta: "+8", up: true },
    { label: "Innovation Rate", value: "15%", delta: "+3%", up: true },
    { label: "Patents Filed", value: "3", delta: "+1", up: true },
  ];

  const columns = [
    { key: "project", label: "Innovation Project" },
    { key: "type", label: "Type" },
    { key: "impact", label: "Impact" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "AI-Powered Analytics", type: "Product", impact: "High", status: "Development" },
    { project: "Blockchain Integration", type: "Technology", impact: "Medium", status: "Research" },
    { project: "Mobile First", type: "Strategy", impact: "High", status: "Development" },
    { project: "Voice Interface", type: "UX", impact: "Medium", status: "Testing" },
    { project: "Automation Suite", type: "Process", impact: "High", status: "Development" },
  ];

  return (
    <AppShell>
      <ModulePage title="Innovation Manager" subtitle="Innovation management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
