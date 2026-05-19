import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-nanoroute")({
  head: () => ({ meta: [{ title: "Nano Route Resolution Engine — Universal Access Admin" }, { name: "description", content: "Dynamic route reconciliation, permission-aware route hydration, stale route invalidation" }] }),
  component: Page,
});

function Page() {
  const { data: routeData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-nanoroute"],
    queryFn: async () => {
      const response = await fetch("/api/root/nano-route-resolution?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch nano route resolution data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Nano Route Resolution Engine" subtitle="Dynamic route reconciliation, permission-aware route hydration, stale route invalidation" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Nano Route Resolution Engine"
          subtitle="Dynamic route reconciliation, permission-aware route hydration, stale route invalidation"
          message="We couldn't load Nano Route Resolution Engine data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = routeData?.data;
  const reconciliation = data?.dynamicRouteReconciliation;
  const hydration = data?.permissionAwareRouteHydration;

  const kpis = [
    { label: "Reconciliation Rate", value: `${reconciliation?.reconciledRoutes}/${reconciliation?.totalReconciliations}`, delta: "—", up: reconciliation?.unreconciledRoutes === 0 },
    { label: "Hydration Rate", value: hydration?.hydrationRate || "0%", delta: "—", up: hydration?.hydrationRate === '100%' },
    { label: "Invalidation Time", value: data?.staleRouteInvalidation?.invalidationTime || "—", delta: "—", up: true },
  ];

  const rows = [
    { metric: "Avg Reconciliation Time", value: reconciliation?.avgReconciliationTime || "—", status: "OK" },
    { metric: "Total Hydrations", value: hydration?.totalHydrations.toString() || "0", status: "OK" },
    { metric: "Total Invalidations", value: data?.staleRouteInvalidation?.totalInvalidations.toString() || "0", status: "OK" },
    { metric: "Orphan Routes Cleaned", value: data?.orphanRouteCleanup?.orphanRoutesCleaned.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Nano Route Resolution Engine" subtitle="Dynamic route reconciliation, permission-aware route hydration, stale route invalidation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
