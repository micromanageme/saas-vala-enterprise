import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-nanodb")({
  head: () => ({ meta: [{ title: "Nano Database Consistency Lock — Universal Access Admin" }, { name: "description", content: "Phantom read detection, isolation-level enforcement, transactional lineage graph" }] }),
  component: Page,
});

function Page() {
  const { data: dbData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-nanodb"],
    queryFn: async () => {
      const response = await fetch("/api/root/nano-db-consistency?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch nano database consistency data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Nano Database Consistency Lock" subtitle="Phantom read detection, isolation-level enforcement, transactional lineage graph" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Nano Database Consistency Lock"
          subtitle="Phantom read detection, isolation-level enforcement, transactional lineage graph"
          message="We couldn't load Nano Database Consistency Lock data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = dbData?.data;
  const phantom = data?.phantomReadDetection;
  const isolation = data?.isolationLevelEnforcement;

  const kpis = [
    { label: "Phantom Reads", value: phantom?.phantomReads.toString() || "0", delta: "—", up: phantom?.phantomReads === 0 },
    { label: "Enforcement Rate", value: isolation?.enforcementRate || "0%", delta: "—", up: isolation?.enforcementRate === '100%' },
    { label: "Conflict Count", value: data?.distributedWriteArbitration?.conflictCount.toString() || "0", delta: "—", up: data?.distributedWriteArbitration?.conflictCount === 0 },
  ];

  const rows = [
    { metric: "Total Reads", value: phantom?.totalReads.toLocaleString() || "0", status: "OK" },
    { metric: "Total Transactions", value: isolation?.totalTransactions.toLocaleString() || "0", status: "OK" },
    { metric: "Tracked Lineages", value: data?.transactionalLineageGraph?.trackedLineages.toLocaleString() || "0", status: "OK" },
    { metric: "Arbitrated Writes", value: data?.distributedWriteArbitration?.arbitratedWrites.toLocaleString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Nano Database Consistency Lock" subtitle="Phantom read detection, isolation-level enforcement, transactional lineage graph" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
