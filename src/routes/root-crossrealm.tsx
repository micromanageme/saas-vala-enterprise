import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-crossrealm")({
  head: () => ({ meta: [{ title: "Universal Cross-Realm Fabric — Universal Access Admin" }, { name: "description", content: "Cloud-edge-onprem federation, hybrid infrastructure orchestration, multi-region authority" }] }),
  component: Page,
});

function Page() {
  const { data: realmData, isLoading, error } = useQuery({
    queryKey: ["root-crossrealm"],
    queryFn: async () => {
      const response = await fetch("/api/root/cross-realm-fabric?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch cross-realm fabric data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Cross-Realm Fabric" subtitle="Cloud-edge-onprem federation, hybrid infrastructure orchestration, multi-region authority" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Cross-Realm Fabric data</div>
      </AppShell>
    );
  }

  const data = realmData?.data;
  const federation = data?.cloudEdgeOnpremFederation;
  const hybrid = data?.hybridInfrastructureOrchestration;

  const kpis = [
    { label: "Federated Realms", value: `${federation?.federatedRealms}/${federation?.totalRealms}`, delta: "—", up: true },
    { label: "Orchestration Success", value: hybrid?.orchestrationSuccess || "0%", delta: "—", up: hybrid?.orchestrationSuccess === '100%' },
    { label: "Sync Latency", value: data?.multiRegionAuthoritySynchronization?.syncLatency || "—", delta: "—", up: true },
  ] : [];

  const rows = [
    { metric: "Federation Status", value: federation?.federationStatus || "—", status: federation?.federationStatus === 'HEALTHY' ? 'OK' : 'WARNING' },
    { metric: "Total Infrastructures", value: hybrid?.totalInfrastructures.toString() || "0", status: "OK" },
    { metric: "Synchronized Regions", value: data?.multiRegionAuthoritySynchronization?.synchronizedRegions.toString() || "0", status: "OK" },
    { metric: "Coordinated Realms", value: data?.sovereignRealmCoordination?.coordinatedRealms.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Cross-Realm Fabric" subtitle="Cloud-edge-onprem federation, hybrid infrastructure orchestration, multi-region authority" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
