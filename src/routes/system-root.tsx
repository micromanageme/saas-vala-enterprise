import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/system-root")({
  head: () => ({ meta: [{ title: "System Root — SaaS Vala" }, { name: "description", content: "System root access" }] }),
  component: Page,
});

function Page() {
  const { data: systemRootData, isLoading, error, refetch } = useQuery({
    queryKey: ["system-root-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/root/dashboard?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch System Root data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="System Root" subtitle="System root access" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="System Root"
          subtitle="System root access"
          message="We couldn't load System Root data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "System Services", value: "45", delta: "+3", up: true },
    { label: "Kernel Health", value: "100%", delta: "—", up: true },
    { label: "Root Access", value: "Active", delta: "—", up: true },
    { label: "Security Level", value: "Maximum", delta: "—", up: true },
  ];

  const columns = [
    { key: "service", label: "System Service" },
    { key: "status", label: "Status" },
    { key: "resource", label: "Resource Usage" },
    { key: "health", label: "Health" },
  ];

  const rows = [
    { service: "Authentication Service", status: "Running", resource: "45%", health: "Healthy" },
    { service: "Authorization Service", status: "Running", resource: "38%", health: "Healthy" },
    { service: "Database Service", status: "Running", resource: "62%", health: "Healthy" },
    { service: "API Gateway", status: "Running", resource: "55%", health: "Healthy" },
    { service: "Message Queue", status: "Running", resource: "42%", health: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="System Root" subtitle="System root access" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
