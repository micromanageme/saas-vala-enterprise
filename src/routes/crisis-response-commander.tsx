import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/crisis-response-commander")({
  head: () => ({ meta: [{ title: "Crisis Response Commander — SaaS Vala" }, { name: "description", content: "Crisis response command workspace" }] }),
  component: Page,
});

function Page() {
  const { data: crisisData, isLoading, error, refetch } = useQuery({
    queryKey: ["crisis-response-commander-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Crisis Response Commander data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Crisis Response Commander" subtitle="Crisis response command workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Crisis Response Commander"
          subtitle="Crisis response command workspace"
          message="We couldn't load Crisis Response Commander data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Crises", value: "5", delta: "+1", up: true },
    { label: "Teams Deployed", value: "35", delta: "+5", up: true },
    { label: "Coordination Score", value: "92%", delta: "+3%", up: true },
    { label: "Resolution Time", value: "4h", delta: "-30min", up: true },
  ];

  const columns = [
    { key: "crisis", label: "Crisis Event" },
    { key: "level", label: "Level" },
    { key: "resources", label: "Resources" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { crisis: "CRS-001", level: "Critical", resources: "High", status: "Active" },
    { crisis: "CRS-002", level: "High", resources: "Medium", status: "Active" },
    { crisis: "CRS-003", level: "Medium", resources: "Low", status: "Monitoring" },
    { crisis: "CRS-004", level: "Critical", resources: "High", status: "In Progress" },
    { crisis: "CRS-005", level: "Low", resources: "Medium", status: "Resolved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Crisis Response Commander" subtitle="Crisis response command workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
