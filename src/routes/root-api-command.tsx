import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-api-command")({
  head: () => ({ meta: [{ title: "Root API Command Center — Universal Access Admin" }, { name: "description", content: "API contracts, schema validation, API replay, throttling" }] }),
  component: Page,
});

function Page() {
  const { data: apiData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-api-command"],
    queryFn: async () => {
      const response = await fetch("/api/root/api-command?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch API command data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Root API Command Center" subtitle="API contracts, schema validation, API replay, throttling" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Root API Command Center"
          subtitle="API contracts, schema validation, API replay, throttling"
          message="We couldn't load Root API Command Center data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = apiData?.data;
  const contracts = data?.apiContracts || [];
  const throttling = data?.throttling;

  const kpis = throttling ? [
    { label: "Total Requests", value: throttling.totalRequests.toLocaleString(), delta: "—", up: true },
    { label: "Throttled", value: throttling.throttledRequests.toString(), delta: "—", up: throttling.throttledRequests === 0 },
    { label: "Rate Limit", value: throttling.rateLimit, delta: "—", up: true },
    { label: "Window", value: throttling.window, delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "API" },
    { key: "version", label: "Version" },
    { key: "status", label: "Status" },
    { key: "endpoints", label: "Endpoints" },
    { key: "lastUpdated", label: "Last Updated" },
  ];

  const rows = contracts.map((c: any) => ({
    name: c.name,
    version: c.version,
    status: c.status,
    endpoints: c.endpoints.toString(),
    lastUpdated: new Date(c.lastUpdated).toLocaleDateString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Root API Command Center" subtitle="API contracts, schema validation, API replay, throttling" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
