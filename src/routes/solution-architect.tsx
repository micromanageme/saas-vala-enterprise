import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/solution-architect")({
  head: () => ({ meta: [{ title: "Solution Architect — SaaS Vala" }, { name: "description", content: "Solution architecture workspace" }] }),
  component: Page,
});

function Page() {
  const { data: saData, isLoading, error, refetch } = useQuery({
    queryKey: ["solution-architect-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Solution Architect data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Solution Architect" subtitle="Solution architecture workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Solution Architect"
          subtitle="Solution architecture workspace"
          message="We couldn't load Solution Architect data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Solutions", value: "8", delta: "+2", up: true },
    { label: "Design Reviews", value: "12", delta: "+3", up: true },
    { label: "Pattern Adoption", value: "85%", delta: "+5%", up: true },
    { label: "Cost Optimization", value: "$150K", delta: "+$50K", up: true },
  ];

  const columns = [
    { key: "solution", label: "Solution" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "complexity", label: "Complexity" },
  ];

  const rows = [
    { solution: "Customer Portal", type: "Web", status: "Design", complexity: "High" },
    { solution: "Mobile API Gateway", type: "API", status: "Implementation", complexity: "Medium" },
    { solution: "Data Lake", type: "Data", status: "Review", complexity: "High" },
    { solution: "Auth Service", type: "Security", status: "Production", complexity: "Medium" },
    { solution: "Notification Hub", type: "Integration", status: "Design", complexity: "Low" },
  ];

  return (
    <AppShell>
      <ModulePage title="Solution Architect" subtitle="Solution architecture workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
