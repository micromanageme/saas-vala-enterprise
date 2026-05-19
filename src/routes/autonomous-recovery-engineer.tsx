import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/autonomous-recovery-engineer")({
  head: () => ({ meta: [{ title: "Autonomous Recovery Engineer — SaaS Vala" }, { name: "description", content: "Autonomous recovery engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: recoveryData, isLoading, error, refetch } = useQuery({
    queryKey: ["autonomous-recovery-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Autonomous Recovery Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Autonomous Recovery Engineer" subtitle="Autonomous recovery engineering workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Autonomous Recovery Engineer"
          subtitle="Autonomous recovery engineering workspace"
          message="We couldn't load Autonomous Recovery Engineer data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Recoveries Performed", value: "45", delta: "+5", up: true },
    { label: "Success Rate", value: "95%", delta: "+2%", up: true },
    { label: "MTTR", value: "2min", delta: "-30sec", up: true },
    { label: "Self-Healing", value: "85%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "recovery", label: "Recovery Event" },
    { key: "type", label: "Type" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { recovery: "REC-001", type: "Service", duration: "1.5min", status: "Completed" },
    { recovery: "REC-002", type: "Database", duration: "2min", status: "Completed" },
    { recovery: "REC-003", type: "Cache", duration: "1min", status: "Completed" },
    { recovery: "REC-004", type: "Network", duration: "3min", status: "In Progress" },
    { recovery: "REC-005", type: "Process", duration: "2.5min", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Autonomous Recovery Engineer" subtitle="Autonomous recovery engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
