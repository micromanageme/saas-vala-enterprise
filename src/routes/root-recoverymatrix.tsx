import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-recoverymatrix")({
  head: () => ({ meta: [{ title: "Root Absolute Recovery Matrix — Universal Access Admin" }, { name: "description", content: "Total ecosystem resurrection, dead-state restoration, corruption rollback lineage" }] }),
  component: Page,
});

function Page() {
  const { data: recoveryData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-recoverymatrix"],
    queryFn: async () => {
      const response = await fetch("/api/root/absolute-recovery-matrix?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch absolute recovery matrix data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Root Absolute Recovery Matrix" subtitle="Total ecosystem resurrection, dead-state restoration, corruption rollback lineage" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Root Absolute Recovery Matrix"
          subtitle="Total ecosystem resurrection, dead-state restoration, corruption rollback lineage"
          message="We couldn't load Root Absolute Recovery Matrix data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = recoveryData?.data;
  const resurrection = data?.totalEcosystemResurrection;
  const restoration = data?.deadStateRestoration;

  const kpis = [
    { label: "Resurrectable Components", value: `${resurrection?.resurrectableComponents}/${resurrection?.totalComponents}`, delta: "—", up: resurrection?.nonResurrectableComponents === 0 },
    { label: "Restoration Success", value: restoration?.restorationSuccess || "0%", delta: "—", up: restoration?.restorationSuccess === '100%' },
    { label: "Recovery Accuracy", value: data?.timelineConsistentRecovery?.recoveryAccuracy || "0%", delta: "—", up: data?.timelineConsistentRecovery?.recoveryAccuracy === '100%' },
  ];

  const rows = [
    { metric: "Resurrection Time", value: resurrection?.resurrectionTime || "—", status: "OK" },
    { metric: "Total States", value: restoration?.totalStates.toString() || "0", status: "OK" },
    { metric: "Total Rollbacks", value: data?.corruptionRollbackLineage?.totalRollbacks.toString() || "0", status: "OK" },
    { metric: "Rollback Depth", value: data?.corruptionRollbackLineage?.rollbackDepth.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Absolute Recovery Matrix" subtitle="Total ecosystem resurrection, dead-state restoration, corruption rollback lineage" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
