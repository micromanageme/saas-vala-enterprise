import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-parliament")({
  head: () => ({ meta: [{ title: "Universal Execution Parliament — Universal Access Admin" }, { name: "description", content: "Distributed approval governance, multi-authority consensus, conflict arbitration" }] }),
  component: Page,
});

function Page() {
  const { data: parliamentData, isLoading, error } = useQuery({
    queryKey: ["root-parliament"],
    queryFn: async () => {
      const response = await fetch("/api/root/execution-parliament?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch execution parliament data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Execution Parliament" subtitle="Distributed approval governance, multi-authority consensus, conflict arbitration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Execution Parliament data</div>
      </AppShell>
    );
  }

  const data = parliamentData?.data;
  const governance = data?.distributedApprovalGovernance;
  const consensus = data?.multiAuthorityConsensus;

  const kpis = [
    { label: "Consensus Rate", value: governance?.consensusRate || "0%", delta: "—", up: parseFloat(governance?.consensusRate || '0') > 90 },
    { label: "Achieved Consensus", value: `${consensus?.achievedConsensus}/${consensus?.totalConsensusVotes}`, delta: "—", up: true },
    { label: "Resolved Conflicts", value: data?.conflictArbitration?.resolvedConflicts.toString() || "0", delta: "—", up: true },
  ];

  const rows = [
    { metric: "Total Approvals", value: governance?.totalApprovals.toString() || "0", status: "OK" },
    { metric: "Avg Consensus Time", value: consensus?.avgConsensusTime || "—", status: "OK" },
    { metric: "Total Negotiations", value: data?.policyNegotiationOrchestration?.totalNegotiations.toString() || "0", status: "OK" },
    { metric: "Successful Negotiations", value: data?.policyNegotiationOrchestration?.successfulNegotiations.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Execution Parliament" subtitle="Distributed approval governance, multi-authority consensus, conflict arbitration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
