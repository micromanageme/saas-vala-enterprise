import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/api-proxy-admin")({
  head: () => ({ meta: [{ title: "API Proxy Admin — SaaS Vala" }, { name: "description", content: "API proxy administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: proxyData, isLoading, error, refetch } = useQuery({
    queryKey: ["api-proxy-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch API Proxy Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="API Proxy Admin" subtitle="API proxy administration workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="API Proxy Admin"
          subtitle="API proxy administration workspace"
          message="We couldn't load API Proxy Admin data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Proxies Active", value: "15", delta: "+2", up: true },
    { label: "Requests/sec", value: "30K", delta: "+3K", up: true },
    { label: "Latency", value: "10ms", delta: "-2ms", up: true },
    { label: "Error Rate", value: "0.1%", delta: "-0.05%", up: true },
  ];

  const columns = [
    { key: "proxy", label: "API Proxy" },
    { key: "route", label: "Route" },
    { key: "upstream", label: "Upstream" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { proxy: "PROXY-001", route: "/api/v1", upstream: "Service A", status: "Active" },
    { proxy: "PROXY-002", route: "/api/v2", upstream: "Service B", status: "Active" },
    { proxy: "PROXY-003", route: "/internal", upstream: "Service C", status: "Active" },
    { proxy: "PROXY-004", route: "/external", upstream: "Service D", status: "Maintenance" },
    { proxy: "PROXY-005", route: "/api/v3", upstream: "Service E", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="API Proxy Admin" subtitle="API proxy administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
