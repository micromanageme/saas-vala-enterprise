import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-microorchestration")({
  head: () => ({ meta: [{ title: "Micro Orchestration Recovery — Universal Access Admin" }, { name: "description", content: "Orchestration deadlock prevention, workflow replay convergence, queue-state reconciliation" }] }),
  component: Page,
});

function Page() {
  const { data: orchestrationData, isLoading, error } = useQuery({
    queryKey: ["root-microorchestration"],
    queryFn: async () => {
      const response = await fetch("/api/root/micro-orchestration-recovery?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch micro orchestration recovery data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Micro Orchestration Recovery" subtitle="Orchestration deadlock prevention, workflow replay convergence, queue-state reconciliation" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Micro Orchestration Recovery data</div>
      </AppShell>
    );
  }

  const data = orchestrationData?.data;
  const deadlock = data?.orchestrationDeadlockPrevention;
  const convergence = data?.workflowReplayConvergence;

  const kpis = [
    { label: "Deadlock Rate", value: deadlock?.deadlockRate || "0%", delta: "—", up: deadlock?.deadlockRate === '0' },
    { label: "Convergence Rate", value: convergence?.convergenceRate || "0%", delta: "—", up: convergence?.convergenceRate === '100%' },
    { label: "Reconciliation Rate", value: data?.queueStateReconciliation?.reconciliationRate || "0%", delta: "—", up: data?.queueStateReconciliation?.reconciliationRate === '100%' },
  ];

  const rows = [
    { metric: "Total Orchestrations", value: deadlock?.totalOrchestrations.toString() || "0", status: "OK" },
    { metric: "Total Replays", value: convergence?.totalReplays.toString() || "0", status: "OK" },
    { metric: "Reconciled Queues", value: data?.queueStateReconciliation?.reconciledQueues.toString() || "0", status: "OK" },
    { metric: "Resolved Arbitrations", value: data?.distributedRecoveryArbitration?.resolvedArbitrations.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Micro Orchestration Recovery" subtitle="Orchestration deadlock prevention, workflow replay convergence, queue-state reconciliation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
