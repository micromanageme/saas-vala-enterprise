// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-validation")({
  head: () => ({ meta: [{ title: "Final Root Validation — Universal Access Admin" }, { name: "description", content: "System validation, dependency mapping, service monitoring" }] }),
  component: Page,
});

function Page() {
  const { data: validationData, isLoading, error } = useQuery({
    queryKey: ["root-validation"],
    queryFn: async () => {
      const response = await fetch("/api/root/validation?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch validation data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Final Root Validation" subtitle="System validation, dependency mapping, service monitoring" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Final Root Validation data</div>
      </AppShell>
    );
  }

  const data = validationData?.data;
  const dependency = data?.dependencyMap;
  const services = data?.serviceMonitoring;
  const permissions = data?.permissionEnforcement;
  const workflows = data?.workflowRecovery;
  const deployments = data?.deploymentReversibility;
  const tenants = data?.tenantIsolation;
  const events = data?.eventTracing;
  const realtime = data?.realtimeSync;
  const health = data?.systemHealth;

  const kpis = health ? [
    { label: "Overall Status", value: health.overallStatus, delta: "—", up: health.overallStatus === 'HEALTHY' },
    { label: "Hidden Failures", value: health.hiddenFailures.toString(), delta: "—", up: health.hiddenFailures === 0 },
    { label: "Orphan Services", value: health.orphanServices.toString(), delta: "—", up: health.orphanServices === 0 },
    { label: "Uncontrolled Access", value: health.uncontrolledAccess.toString(), delta: "—", up: health.uncontrolledAccess === 0 },
  ] : [];

  const rows = [
    { metric: "Dependencies Mapped", value: `${dependency?.mappedDependencies}/${dependency?.totalDependencies}`, status: dependency?.unmappedDependencies === 0 ? 'OK' : 'WARNING' },
    { metric: "Services Healthy", value: `${services?.healthyServices}/${services?.totalServices}`, status: services?.failedServices === 0 ? 'OK' : 'CRITICAL' },
    { metric: "Permissions Enforced", value: `${permissions?.enforcedPermissions}/${permissions?.totalPermissions}`, status: permissions?.unenforcedPermissions === 0 ? 'OK' : 'CRITICAL' },
    { metric: "Workflows Recoverable", value: `${workflowRecovery?.recoverableWorkflows}/${workflowRecovery?.totalWorkflows}`, status: 'OK' },
    { metric: "Deployments Reversible", value: `${deployments?.reversibleDeployments}/${deployments?.totalDeployments}`, status: 'OK' },
    { metric: "Tenants Isolated", value: `${tenants?.isolatedTenants}/${tenants?.totalTenants}`, status: tenants?.leakDetected ? 'CRITICAL' : 'OK' },
    { metric: "Events Traceable", value: `${events?.traceableStreams}/${events?.totalEventStreams}`, status: 'OK' },
    { metric: "Realtime Synced", value: `${realtime?.synchronizedFlows}/${realtime?.realtimeFlows}`, status: 'OK' },
  ];

  const columns = [
    { key: "metric", label: "Validation" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Final Root Validation" subtitle="System validation, dependency mapping, service monitoring" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
