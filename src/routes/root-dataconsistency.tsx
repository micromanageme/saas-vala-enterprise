import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-dataconsistency")({
  head: () => ({ meta: [{ title: "Root Data Consistency Engine — Universal Access Admin" }, { name: "description", content: "Replication consistency, transaction reconciliation, stale read detection" }] }),
  component: Page,
});

function Page() {
  const { data: consistencyData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-dataconsistency"],
    queryFn: async () => {
      const response = await fetch("/api/root/data-consistency?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch data consistency data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Root Data Consistency Engine" subtitle="Replication consistency, transaction reconciliation, stale read detection" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Root Data Consistency Engine"
          subtitle="Replication consistency, transaction reconciliation, stale read detection"
          message="We couldn't load Root Data Consistency Engine data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = consistencyData?.data;
  const replication = data?.replicationConsistency;
  const transactions = data?.transactionReconciliation;

  const kpis = [
    { label: "Consistent Replicas", value: `${replication?.consistentReplicas}/${replication?.totalReplicas}`, delta: "—", up: true },
    { label: "Reconciled Transactions", value: `${transactions?.reconciledTransactions.toLocaleString()}/${transactions?.totalTransactions.toLocaleString()}`, delta: "—", up: true },
    { label: "Stale Read Rate", value: data?.staleReadDetection?.staleReadRate || "0%", delta: "—", up: data?.staleReadDetection?.staleReadRate === '0%' },
  ];

  const rows = [
    { metric: "Total Replicas", value: replication?.totalReplicas.toString() || "0", status: "OK" },
    { metric: "Consistent Replicas", value: replication?.consistentReplicas.toString() || "0", status: "OK" },
    { metric: "Total Transactions", value: transactions?.totalTransactions.toLocaleString() || "0", status: "OK" },
    { metric: "Total Reads", value: data?.staleReadDetection?.totalReads.toLocaleString() || "0", status: "OK" },
    { metric: "Stale Reads", value: data?.staleReadDetection?.staleReads.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Data Consistency Engine" subtitle="Replication consistency, transaction reconciliation, stale read detection" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
