import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/universal-governance-council")({
  head: () => ({ meta: [{ title: "Universal Governance Council — SaaS Vala" }, { name: "description", content: "Universal governance council workspace" }] }),
  component: Page,
});

function Page() {
  const { data: councilData, isLoading, error, refetch } = useQuery({
    queryKey: ["universal-governance-council-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Universal Governance Council data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Universal Governance Council" subtitle="Universal governance council workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Universal Governance Council"
          subtitle="Universal governance council workspace"
          message="We couldn't load Universal Governance Council data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Governance Policies", value: "50", delta: "+5", up: true },
    { label: "Compliance Rate", value: "98%", delta: "+1%", up: true },
    { label: "Decisions Made", value: "25", delta: "+3", up: true },
    { label: "Global Impact", value: "100%", delta: "0%", up: true },
  ];

  const columns = [
    { key: "policy", label: "Governance Policy" },
    { key: "scope", label: "Scope" },
    { key: "regions", label: "Regions" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { policy: "GOV-001", scope: "Global", regions: "50", status: "Active" },
    { policy: "GOV-002", scope: "Regional", regions: "10", status: "Active" },
    { policy: "GOV-003", scope: "Global", regions: "50", status: "In Review" },
    { policy: "GOV-004", scope: "Regional", regions: "15", status: "Active" },
    { policy: "GOV-005", scope: "Global", regions: "50", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Governance Council" subtitle="Universal governance council workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
