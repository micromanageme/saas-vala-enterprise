import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-orchestration")({
  head: () => ({ meta: [{ title: "Orchestration Engine — Universal Access Admin" }, { name: "description", content: "Root-level workflow and automation control" }] }),
  component: Page,
});

function Page() {
  const { data: orchestrationData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-orchestration"],
    queryFn: async () => {
      const response = await fetch("/api/root/orchestration?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch orchestration data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Orchestration Engine" subtitle="Root-level workflow and automation control" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Orchestration Engine"
          subtitle="Root-level workflow and automation control"
          message="We couldn't load Orchestration Engine data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = orchestrationData?.data;
  const workflows = data?.workflows || [];
  const eventBus = data?.eventBus;

  const kpis = eventBus ? [
    { label: "Total Events", value: eventBus.totalEvents.toLocaleString(), delta: "—", up: true },
    { label: "Processed", value: eventBus.processedEvents.toLocaleString(), delta: "—", up: true },
    { label: "Failed", value: eventBus.failedEvents.toString(), delta: "—", up: false },
    { label: "Throughput", value: eventBus.throughput.toString(), delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "Workflow" },
    { key: "status", label: "Status" },
    { key: "executions", label: "Executions" },
    { key: "successRate", label: "Success Rate" },
    { key: "avgDuration", label: "Avg Duration" },
  ];

  const rows = workflows.map((w: any) => ({
    name: w.name,
    status: w.status,
    executions: w.executions.toLocaleString(),
    successRate: `${w.successRate}%`,
    avgDuration: `${w.avgDuration}s`,
  }));

  return (
    <AppShell>
      <ModulePage title="Orchestration Engine" subtitle="Root-level workflow and automation control" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
