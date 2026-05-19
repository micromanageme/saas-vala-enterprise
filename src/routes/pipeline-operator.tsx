import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/pipeline-operator")({
  head: () => ({ meta: [{ title: "Pipeline Operator — SaaS Vala" }, { name: "description", content: "Pipeline operation workspace" }] }),
  component: Page,
});

function Page() {
  const { data: pipelineData, isLoading, error, refetch } = useQuery({
    queryKey: ["pipeline-operator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Pipeline Operator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Pipeline Operator" subtitle="Pipeline operation workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Pipeline Operator"
          subtitle="Pipeline operation workspace"
          message="We couldn't load Pipeline Operator data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Pipelines Active", value: "25", delta: "+3", up: true },
    { label: "Jobs Processed", value: "5.2K", delta: "+500", up: true },
    { label: "Success Rate", value: "96%", delta: "+2%", up: true },
    { label: "Avg Duration", value: "5min", delta: "-1min", up: true },
  ];

  const columns = [
    { key: "pipeline", label: "Pipeline" },
    { key: "stage", label: "Current Stage" },
    { key: "jobs", label: "Jobs Queued" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { pipeline: "PIPE-001", stage: "Processing", jobs: "50", status: "Running" },
    { pipeline: "PIPE-002", stage: "Validation", jobs: "30", status: "Running" },
    { pipeline: "PIPE-003", stage: "Completed", jobs: "0", status: "Completed" },
    { pipeline: "PIPE-004", stage: "Queued", jobs: "20", status: "Pending" },
    { pipeline: "PIPE-005", stage: "Processing", jobs: "40", status: "Running" },
  ];

  return (
    <AppShell>
      <ModulePage title="Pipeline Operator" subtitle="Pipeline operation workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
