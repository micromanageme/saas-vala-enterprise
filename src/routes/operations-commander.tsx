import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/operations-commander")({
  head: () => ({ meta: [{ title: "Operations Commander — SaaS Vala" }, { name: "description", content: "Operations command center" }] }),
  component: Page,
});

function Page() {
  const { data: opsCommanderData, isLoading, error, refetch } = useQuery({
    queryKey: ["operations-commander-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Operations Commander data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Operations Commander" subtitle="Operations command center" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Operations Commander"
          subtitle="Operations command center"
          message="We couldn't load Operations Commander data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Global Operations", value: "12 regions", delta: "+1", up: true },
    { label: "Operational Efficiency", value: "94%", delta: "+2%", up: true },
    { label: "SLA Compliance", value: "98%", delta: "+1%", up: true },
    { label: "Incidents", value: "2", delta: "-1", up: true },
  ];

  const columns = [
    { key: "operation", label: "Global Operation" },
    { key: "region", label: "Region" },
    { key: "efficiency", label: "Efficiency" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { operation: "Data Center Operations", region: "North America", efficiency: "96%", status: "Healthy" },
    { operation: "Network Operations", region: "Europe", efficiency: "94%", status: "Healthy" },
    { operation: "Service Operations", region: "Asia Pacific", efficiency: "93%", status: "Healthy" },
    { operation: "Security Operations", region: "Global", efficiency: "98%", status: "Healthy" },
    { operation: "Support Operations", region: "North America", efficiency: "92%", status: "Degraded" },
  ];

  return (
    <AppShell>
      <ModulePage title="Operations Commander" subtitle="Operations command center" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
