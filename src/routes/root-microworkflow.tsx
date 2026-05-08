import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-microworkflow")({
  head: () => ({ meta: [{ title: "Micro Workflow Mutation Tracking — Universal Access Admin" }, { name: "description", content: "Workflow branch lineage, mutation rollback snapshots, execution drift tracing" }] }),
  component: Page,
});

function Page() {
  const { data: workflowData, isLoading, error } = useQuery({
    queryKey: ["root-microworkflow"],
    queryFn: async () => {
      const response = await fetch("/api/root/micro-workflow-mutation?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch micro workflow mutation data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Micro Workflow Mutation Tracking" subtitle="Workflow branch lineage, mutation rollback snapshots, execution drift tracing" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Micro Workflow Mutation Tracking data</div>
      </AppShell>
    );
  }

  const data = workflowData?.data;
  const lineage = data?.workflowBranchLineage;
  const snapshots = data?.mutationRollbackSnapshots;

  const kpis = [
    { label: "Tracked Branches", value: `${lineage?.trackedBranches}/${lineage?.totalBranches}`, delta: "—", up: lineage?.untrackedBranches === 0 },
    { label: "Valid Snapshots", value: `${snapshots?.validSnapshots}/${snapshots?.totalSnapshots}`, delta: "—", up: snapshots?.corruptedSnapshots === 0 },
    { label: "Corrected Drifts", value: data?.executionDriftTracing?.correctedDrifts.toString() || "0", delta: "—", up: true },
  ] : [];

  const rows = [
    { metric: "Max Branch Depth", value: lineage?.maxBranchDepth.toString() || "0", status: "OK" },
    { metric: "Snapshot Retention", value: snapshots?.snapshotRetention || "—", status: "OK" },
    { metric: "Drift Rate", value: data?.executionDriftTracing?.driftRate || "0%", status: "OK" },
    { metric: "Blocked Transitions", value: data?.invalidTransitionPrevention?.blockedTransitions.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Micro Workflow Mutation Tracking" subtitle="Workflow branch lineage, mutation rollback snapshots, execution drift tracing" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
