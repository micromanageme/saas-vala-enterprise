import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/release-pipeline-supervisor")({
  head: () => ({ meta: [{ title: "Release Pipeline Supervisor — SaaS Vala" }, { name: "description", content: "Release pipeline supervision workspace" }] }),
  component: Page,
});

function Page() {
  const { data: pipelineData, isLoading, error, refetch } = useQuery({
    queryKey: ["release-pipeline-supervisor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Release Pipeline Supervisor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Release Pipeline Supervisor" subtitle="Release pipeline supervision workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Release Pipeline Supervisor"
          subtitle="Release pipeline supervision workspace"
          message="We couldn't load Release Pipeline Supervisor data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Releases Today", value: "15", delta: "+2", up: true },
    { label: "Success Rate", value: "92%", delta: "+3%", up: true },
    { label: "Avg Build Time", value: "10min", delta: "-1min", up: true },
    { label: "Deployments", value: "25", delta: "+3", up: true },
  ];

  const columns = [
    { key: "pipeline", label: "Release Pipeline" },
    { key: "stage", label: "Stage" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { pipeline: "PIPE-001", stage: "Build", duration: "5min", status: "In Progress" },
    { pipeline: "PIPE-002", stage: "Test", duration: "8min", status: "Completed" },
    { pipeline: "PIPE-003", stage: "Deploy", duration: "2min", status: "Completed" },
    { pipeline: "PIPE-004", stage: "Build", duration: "6min", status: "Queued" },
    { pipeline: "PIPE-005", stage: "Test", duration: "7min", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Release Pipeline Supervisor" subtitle="Release pipeline supervision workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
