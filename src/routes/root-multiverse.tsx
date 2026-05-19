import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-multiverse")({
  head: () => ({ meta: [{ title: "Universal Multiverse Environment Control — Universal Access Admin" }, { name: "description", content: "Dev/staging/prod isolation, sandbox universes, branch environment orchestration" }] }),
  component: Page,
});

function Page() {
  const { data: multiverseData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-multiverse"],
    queryFn: async () => {
      const response = await fetch("/api/root/multiverse-environment?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch multiverse environment data");
      return response.json();
    },
    refetchInterval: 20000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Universal Multiverse Environment Control" subtitle="Dev/staging/prod isolation, sandbox universes, branch environment orchestration" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Universal Multiverse Environment Control"
          subtitle="Dev/staging/prod isolation, sandbox universes, branch environment orchestration"
          message="We couldn't load Universal Multiverse Environment Control data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = multiverseData?.data;
  const environments = data?.environmentIsolation || [];
  const sandbox = data?.sandboxUniverses;

  const kpis = sandbox ? [
    { label: "Active Universes", value: `${sandbox?.activeUniverses}/${sandbox?.totalUniverses}`, delta: "—", up: true },
    { label: "Orchestrated Branches", value: data?.branchEnvironmentOrchestration?.orchestratedBranches.toString() || "0", delta: "—", up: true },
    { label: "Active Clusters", value: data?.isolatedSimulationClusters?.activeClusters.toString() || "0", delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "Environment" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "resources", label: "Resources" },
  ];

  const rows = environments.map((e: any) => ({
    name: e.name,
    type: e.type,
    status: e.status,
    resources: e.resources,
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Multiverse Environment Control" subtitle="Dev/staging/prod isolation, sandbox universes, branch environment orchestration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
