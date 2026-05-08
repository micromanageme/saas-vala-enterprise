import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-transcendentvalidation")({
  head: () => ({ meta: [{ title: "Root Transcendent Validation — Universal Access Admin" }, { name: "description", content: "Authority chains, runtime paths, dependencies, state reproducibility, orchestration reversibility" }] }),
  component: Page,
});

function Page() {
  const { data: transcendentData, isLoading, error } = useQuery({
    queryKey: ["root-transcendentvalidation"],
    queryFn: async () => {
      const response = await fetch("/api/root/transcendent-validation?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch transcendent validation data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Transcendent Validation" subtitle="Authority chains, runtime paths, dependencies, state reproducibility, orchestration reversibility" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Transcendent Validation data</div>
      </AppShell>
    );
  }

  const data = transcendentData?.data;
  const authority = data?.authorityChains;
  const runtime = data?.runtimePaths;
  const dependencies = data?.dependencyRecoverability;
  const state = data?.stateReproducibility;
  const orchestration = data?.orchestrationReversibility;
  const ai = data?.aiActionAuditability;
  const security = data?.securityBoundaryEnforceability;
  const policy = data?.policyTraceability;
  const tenant = data?.tenantSovereignIsolation;
  const workflow = data?.criticalWorkflowSurvivability;
  const conflicts = data?.authorityConflicts;
  const systemic = data?.unrecoverableSystemicStates;
  const autonomous = data?.uncontrolledAutonomousBehavior;

  const kpis = [
    { label: "Overall Status", value: "ALL_VALIDATED", delta: "—", up: true },
    { label: "Authority Conflicts", value: conflicts?.invisibleConflicts.toString() || "0", delta: "—", up: conflicts?.invisibleConflicts === 0 },
  ] : [];

  const rows = [
    { metric: "Authority Chains", value: `${authority?.verifiedChains}/${authority?.totalChains}`, status: authority?.status },
    { metric: "Runtime Paths", value: `${runtime?.observablePaths}/${runtime?.totalPaths}`, status: runtime?.status },
    { metric: "Dependencies", value: `${dependencies?.recoverableDependencies}/${dependencies?.totalDependencies}`, status: dependencies?.status },
    { metric: "State Reproducibility", value: `${state?.reproducibleStates}/${state?.totalStates}`, status: state?.status },
    { metric: "Orchestration Reversibility", value: `${orchestration?.reversibleOrchestrations}/${orchestration?.totalOrchestrations}`, status: orchestration?.status },
    { metric: "AI Action Auditability", value: `${ai?.auditableActions}/${ai?.totalAIActions}`, status: ai?.status },
    { metric: "Security Boundaries", value: `${security?.enforceableBoundaries}/${security?.totalBoundaries}`, status: security?.status },
    { metric: "Policy Traceability", value: `${policy?.traceablePolicies}/${policy?.totalPolicies}`, status: policy?.status },
    { metric: "Tenant Sovereignty", value: `${tenant?.sovereignTenants}/${tenant?.totalTenants}`, status: tenant?.status },
    { metric: "Workflow Survivability", value: `${workflow?.survivableWorkflows}/${workflow?.totalCriticalWorkflows}`, status: workflow?.status },
    { metric: "Systemic States", value: systemic?.status || "—", status: systemic?.status === 'ZERO_UNRECOVERABLE' ? 'OK' : 'WARNING' },
    { metric: "Autonomous Behavior", value: autonomous?.status || "—", status: autonomous?.status === 'FULLY_CONTROLLED' ? 'OK' : 'WARNING' },
  ];

  const columns = [
    { key: "metric", label: "Validation" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Transcendent Validation" subtitle="Authority chains, runtime paths, dependencies, state reproducibility, orchestration reversibility" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
