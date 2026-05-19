import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/strategy-manager")({
  head: () => ({ meta: [{ title: "Strategy Manager — SaaS Vala" }, { name: "description", content: "Strategy management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: strategyData, isLoading, error, refetch } = useQuery({
    queryKey: ["strategy-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Strategy Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Strategy Manager" subtitle="Strategy management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Strategy Manager"
          subtitle="Strategy management workspace"
          message="We couldn't load Strategy Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Strategic Initiatives", value: "8", delta: "+1", up: true },
    { label: "Strategy Alignment", value: "92%", delta: "+3%", up: true },
    { label: "Market Position", value: "#3", delta: "+1", up: true },
    { label: "Growth Target", value: "25%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "initiative", label: "Strategic Initiative" },
    { key: "priority", label: "Priority" },
    { key: "progress", label: "Progress" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { initiative: "Market Expansion", priority: "High", progress: "65%", status: "On Track" },
    { initiative: "Product Innovation", priority: "High", progress: "80%", status: "On Track" },
    { initiative: "Digital Transformation", priority: "Critical", progress: "75%", status: "On Track" },
    { initiative: "Strategic Partnerships", priority: "Medium", progress: "50%", status: "In Progress" },
    { initiative: "M&A Activity", priority: "Medium", progress: "30%", status: "Planning" },
  ];

  return (
    <AppShell>
      <ModulePage title="Strategy Manager" subtitle="Strategy management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
