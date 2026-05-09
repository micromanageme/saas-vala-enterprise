import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-workflowfabric")({
  head: () => ({ meta: [{ title: "Universal Workflow Fabric — Universal Access Admin" }, { name: "description", content: "Cross-module workflow chaining, replay, rollback, state-machine validation" }] }),
  component: Page,
});

function Page() {
  const { data: workflowData, isLoading, error } = useQuery({
    queryKey: ["root-workflowfabric"],
    queryFn: async () => {
      const response = await fetch("/api/root/workflow-fabric?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch workflow fabric data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Workflow Fabric" subtitle="Cross-module workflow chaining, replay, rollback, state-machine validation" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Workflow Fabric data</div>
      </AppShell>
    );
  }

  const data = workflowData?.data;
  const workflows = data?.crossModuleWorkflows || [];
  const replay = data?.workflowReplay;

  const kpis = replay ? [
    { label: "Total Workflows", value: workflows.length.toString(), delta: "—", up: true },
    { label: "Successful Replays", value: replay.successfulReplays.toString(), delta: "—", up: true },
    { label: "Failed Replays", value: replay.failedReplays.toString(), delta: "—", up: replay.failedReplays === 0 },
  ];

  const columns = [
    { key: "name", label: "Workflow" },
    { key: "modules", label: "Modules" },
    { key: "status", label: "Status" },
    { key: "executions", label: "Executions" },
  ];

  const rows = workflows.map((w: any) => ({
    name: w.name,
    modules: w.modules.join(", "),
    status: w.status,
    executions: w.executions.toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Workflow Fabric" subtitle="Cross-module workflow chaining, replay, rollback, state-machine validation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
