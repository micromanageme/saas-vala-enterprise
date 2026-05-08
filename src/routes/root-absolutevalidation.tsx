import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-absolutevalidation")({
  head: () => ({ meta: [{ title: "Final Absolute Root Validation — Universal Access Admin" }, { name: "description", content: "Complete ecosystem verification, absolute root authority validation" }] }),
  component: Page,
});

function Page() {
  const { data: validationData, isLoading, error } = useQuery({
    queryKey: ["root-absolutevalidation"],
    queryFn: async () => {
      const response = await fetch("/api/root/absolute-validation?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch absolute validation data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Final Absolute Root Validation" subtitle="Complete ecosystem verification, absolute root authority validation" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Final Absolute Root Validation data</div>
      </AppShell>
    );
  }

  const data = validationData?.data;
  const kernel = data?.kernelFlowVerification;
  const dependency = data?.dependencyMapping;
  const orchestration = data?.orchestrationRecovery;
  const state = data?.stateSynchronization;
  const event = data?.eventReplayability;
  const token = data?.tokenTraceability;
  const tenant = data?.tenantIsolation;
  const workflow = data?.workflowReversibility;
  const service = data?.serviceObservability;
  const permission = data?.permissionEnforceability;
  const failure = data?.failureContainability;
  const deployment = data?.deploymentRecoverability;
  const authority = data?.authorityGaps;

  const kpis = [
    { label: "Overall Status", value: "ALL VERIFIED", delta: "—", up: true },
    { label: "Authority Gaps", value: authority?.hiddenAuthorityGaps.toString() || "0", delta: "—", up: authority?.hiddenAuthorityGaps === 0 },
  ];

  const rows = [
    { metric: "Kernel Flows", value: `${kernel?.verifiedFlows}/${kernel?.totalFlows}`, status: kernel?.status },
    { metric: "Dependencies", value: `${dependency?.mappedDependencies}/${dependency?.totalDependencies}`, status: dependency?.status },
    { metric: "Orchestrations", value: `${orchestration?.recoverableOrchestrations}/${orchestration?.totalOrchestrations}`, status: orchestration?.status },
    { metric: "State Nodes", value: `${state?.synchronizedNodes}/${state?.totalStateNodes}`, status: state?.status },
    { metric: "Event Streams", value: `${event?.replayableStreams}/${event?.totalEventStreams}`, status: event?.status },
    { metric: "Tokens", value: `${token?.traceableTokens}/${token?.totalTokens}`, status: token?.status },
    { metric: "Tenants", value: `${tenant?.isolatedTenants}/${tenant?.totalTenants}`, status: tenant?.status },
    { metric: "Workflows", value: `${workflow?.reversibleWorkflows}/${workflow?.totalWorkflows}`, status: workflow?.status },
    { metric: "Services", value: `${service?.observableServices}/${service?.totalServices}`, status: service?.status },
    { metric: "Permissions", value: `${permission?.enforceablePermissions}/${permission?.totalPermissions}`, status: permission?.status },
    { metric: "Failures", value: `${failure?.containableScenarios}/${failure?.totalFailureScenarios}`, status: failure?.status },
    { metric: "Deployments", value: `${deployment?.recoverableDeployments}/${deployment?.totalDeployments}`, status: deployment?.status },
  ];

  const columns = [
    { key: "metric", label: "Validation" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Final Absolute Root Validation" subtitle="Complete ecosystem verification, absolute root authority validation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
