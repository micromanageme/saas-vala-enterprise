import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-nanouistate")({
  head: () => ({ meta: [{ title: "Nano UI State Synthesis — Universal Access Admin" }, { name: "description", content: "Hidden state convergence, stale UI invalidation, render dependency reconciliation" }] }),
  component: Page,
});

function Page() {
  const { data: uiData, isLoading, error } = useQuery({
    queryKey: ["root-nanouistate"],
    queryFn: async () => {
      const response = await fetch("/api/root/nano-ui-state?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch nano UI state data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Nano UI State Synthesis" subtitle="Hidden state convergence, stale UI invalidation, render dependency reconciliation" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Nano UI State Synthesis data</div>
      </AppShell>
    );
  }

  const data = uiData?.data;
  const convergence = data?.hiddenStateConvergence;
  const invalidation = data?.staleUIInvalidation;

  const kpis = [
    { label: "Convergence Rate", value: convergence?.convergenceRate || "0%", delta: "—", up: convergence?.convergenceRate === '100%' },
    { label: "Invalidated UIs", value: `${invalidation?.invalidatedUIs}/${invalidation?.totalInvalidations}`, delta: "—", up: invalidation?.missedInvalidations === 0 },
    { label: "Resolved Arbitrations", value: data?.componentHydrationArbitration?.resolvedArbitrations.toString() || "0", delta: "—", up: true },
  ];

  const rows = [
    { metric: "Total States", value: convergence?.totalStates.toString() || "0", status: "OK" },
    { metric: "Invalidation Time", value: invalidation?.invalidationTime || "—", status: "OK" },
    { metric: "Reconciled Dependencies", value: data?.renderDependencyReconciliation?.reconciledDependencies.toString() || "0", status: "OK" },
    { metric: "Avg Arbitration Time", value: data?.componentHydrationArbitration?.avgArbitrationTime || "—", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Nano UI State Synthesis" subtitle="Hidden state convergence, stale UI invalidation, render dependency reconciliation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
