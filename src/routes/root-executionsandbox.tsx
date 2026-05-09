import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-executionsandbox")({
  head: () => ({ meta: [{ title: "Root Execution Sandbox — Universal Access Admin" }, { name: "description", content: "Isolated runtime execution, privileged simulation, unsafe containment" }] }),
  component: Page,
});

function Page() {
  const { data: sandboxData, isLoading, error } = useQuery({
    queryKey: ["root-executionsandbox"],
    queryFn: async () => {
      const response = await fetch("/api/root/execution-sandbox?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch execution sandbox data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Execution Sandbox" subtitle="Isolated runtime execution, privileged simulation, unsafe containment" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Execution Sandbox data</div>
      </AppShell>
    );
  }

  const data = sandboxData?.data;
  const executions = data?.isolatedExecutions || [];
  const containment = data?.unsafeContainment;

  const kpis = containment ? [
    { label: "Containment Rate", value: containment.containmentRate, delta: "—", up: containment.containmentRate === '100%' },
    { label: "Total Executions", value: data?.rollbackSafety?.totalExecutions.toString() || "0", delta: "—", up: true },
    { label: "All Safe", value: data?.rollbackSafety?.status || "—", delta: "—", up: data?.rollbackSafety?.status === 'ALL_SAFE' },
  ] : [];

  const columns = [
    { key: "taskId", label: "Task ID" },
    { key: "status", label: "Status" },
    { key: "duration", label: "Duration" },
    { key: "safe", label: "Safe" },
  ];

  const rows = executions.map((e: any) => ({
    taskId: e.taskId,
    status: e.status,
    duration: e.duration + "s",
    safe: e.safe ? "Yes" : "No",
  }));

  return (
    <AppShell>
      <ModulePage title="Root Execution Sandbox" subtitle="Isolated runtime execution, privileged simulation, unsafe containment" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
