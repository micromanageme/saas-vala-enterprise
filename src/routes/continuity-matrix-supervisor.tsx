import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/continuity-matrix-supervisor")({
  head: () => ({ meta: [{ title: "Continuity Matrix Supervisor — SaaS Vala" }, { name: "description", content: "Continuity matrix supervision workspace" }] }),
  component: Page,
});

function Page() {
  const { data: continuityData, isLoading, error, refetch } = useQuery({
    queryKey: ["continuity-matrix-supervisor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Continuity Matrix Supervisor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Continuity Matrix Supervisor" subtitle="Continuity matrix supervision workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Continuity Matrix Supervisor"
          subtitle="Continuity matrix supervision workspace"
          message="We couldn't load Continuity Matrix Supervisor data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Continuity Nodes", value: "75", delta: "+8", up: true },
    { label: "Uptime", value: "99.95%", delta: "+0.05%", up: true },
    { label: "Failovers", value: "12", delta: "+2", up: true },
    { label: "Recovery Time", value: "30sec", delta: "-5sec", up: true },
  ];

  const columns = [
    { key: "node", label: "Continuity Node" },
    { key: "cluster", label: "Cluster" },
    { key: "health", label: "Health" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { node: "CNT-001", cluster: "Primary", health: "100%", status: "Active" },
    { node: "CNT-002", cluster: "Secondary", health: "100%", status: "Standby" },
    { node: "CNT-003", cluster: "Primary", health: "98%", status: "Active" },
    { node: "CNT-004", cluster: "Tertiary", health: "100%", status: "Standby" },
    { node: "CNT-005", cluster: "Primary", health: "95%", status: "Degraded" },
  ];

  return (
    <AppShell>
      <ModulePage title="Continuity Matrix Supervisor" subtitle="Continuity matrix supervision workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
