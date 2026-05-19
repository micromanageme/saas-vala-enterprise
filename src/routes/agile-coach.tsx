import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/agile-coach")({
  head: () => ({ meta: [{ title: "Agile Coach — SaaS Vala" }, { name: "description", content: "Agile coaching workspace" }] }),
  component: Page,
});

function Page() {
  const { data: agileData, isLoading, error, refetch } = useQuery({
    queryKey: ["agile-coach-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Agile Coach data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Agile Coach" subtitle="Agile coaching workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Agile Coach"
          subtitle="Agile coaching workspace"
          message="We couldn't load Agile Coach data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Teams Coached", value: "5", delta: "+1", up: true },
    { label: "Agile Maturity", value: "4.2/5", delta: "+0.3", up: true },
    { label: "Training Sessions", value: "12", delta: "+3", up: true },
    { label: "Process Improvements", value: "8", delta: "+2", up: true },
  ];

  const columns = [
    { key: "team", label: "Team" },
    { key: "maturity", label: "Maturity" },
    { key: "framework", label: "Framework" },
    { key: "focus", label: "Focus Area" },
  ];

  const rows = [
    { team: "Engineering Team A", maturity: "4.5/5", framework: "Scrum", focus: "Velocity" },
    { team: "Engineering Team B", maturity: "4.0/5", framework: "Kanban", focus: "Flow" },
    { team: "Product Team", maturity: "3.8/5", framework: "Scrum", focus: "Backlog" },
    { team: "Design Team", maturity: "4.2/5", framework: "Kanban", focus: "Delivery" },
    { team: "QA Team", maturity: "4.0/5", framework: "Scrum", focus: "Quality" },
  ];

  return (
    <AppShell>
      <ModulePage title="Agile Coach" subtitle="Agile coaching workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
