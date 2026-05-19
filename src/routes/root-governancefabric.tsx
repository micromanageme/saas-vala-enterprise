import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-governancefabric")({
  head: () => ({ meta: [{ title: "Universal Governance Fabric — Universal Access Admin" }, { name: "description", content: "Governance hierarchy, operational governance, policy lineage, approval governance" }] }),
  component: Page,
});

function Page() {
  const { data: governanceData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-governancefabric"],
    queryFn: async () => {
      const response = await fetch("/api/root/governance-fabric?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch governance fabric data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Universal Governance Fabric" subtitle="Governance hierarchy, operational governance, policy lineage, approval governance" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Universal Governance Fabric"
          subtitle="Governance hierarchy, operational governance, policy lineage, approval governance"
          message="We couldn't load Universal Governance Fabric data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = governanceData?.data;
  const hierarchy = data?.governanceHierarchy;
  const operational = data?.operationalGovernance;
  const approvals = data?.approvalGovernance;

  const kpis = [
    { label: "Total Levels", value: hierarchy?.totalLevels.toString() || "0", delta: "—", up: true },
    { label: "Active Governors", value: hierarchy?.activeGovernors.toString() || "0", delta: "—", up: true },
    { label: "Enforced Policies", value: `${operational?.enforcedPolicies}/${operational?.totalPolicies}`, delta: "—", up: true },
  ];

  const rows = [
    { metric: "Total Governors", value: hierarchy?.totalGovernors.toString() || "0", status: "OK" },
    { metric: "Active Governors", value: hierarchy?.activeGovernors.toString() || "0", status: "OK" },
    { metric: "Inactive Governors", value: hierarchy?.inactiveGovernors.toString() || "0", status: "OK" },
    { metric: "Total Policies", value: operational?.totalPolicies.toString() || "0", status: "OK" },
    { metric: "Enforced Policies", value: operational?.enforcedPolicies.toString() || "0", status: "OK" },
    { metric: "Total Approvals", value: approvals?.totalApprovals.toString() || "0", status: "OK" },
    { metric: "Approved Requests", value: approvals?.approvedRequests.toString() || "0", status: "OK" },
    { metric: "Pending Requests", value: approvals?.pendingRequests.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Governance Fabric" subtitle="Governance hierarchy, operational governance, policy lineage, approval governance" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
