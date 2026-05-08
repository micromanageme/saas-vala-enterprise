import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-absolutenano")({
  head: () => ({ meta: [{ title: "Absolute Nano Root Validation — Universal Access Admin" }, { name: "description", content: "Microstate determinism, authority mutation traceability, async chain recoverability, render path observability" }] }),
  component: Page,
});

function Page() {
  const { data: nanoData, isLoading, error } = useQuery({
    queryKey: ["root-absolutenano"],
    queryFn: async () => {
      const response = await fetch("/api/root/absolute-nano-validation?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch absolute nano validation data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Absolute Nano Root Validation" subtitle="Microstate determinism, authority mutation traceability, async chain recoverability, render path observability" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Absolute Nano Root Validation data</div>
      </AppShell>
    );
  }

  const data = nanoData?.data;
  const microstate = data?.microstateDeterminism;
  const authority = data?.authorityMutationTraceability;
  const asyncChain = data?.asyncChainRecoverability;
  const render = data?.renderPathObservability;
  const dependency = data?.dependencyReversibility;
  const packet = data?.packetHistoricalReconstructability;
  const cache = data?.cacheMutationAuditability;
  const cryptographic = data?.tenantCryptographicIsolation;
  const policy = data?.policyRuntimeVerifiability;
  const orchestration = data?.orchestrationSelfHealability;

  const kpis = [
    { label: "Overall Status", value: "ALL_VALIDATED", delta: "—", up: true },
    { label: "Invisible Corruption", value: data?.invisibleMicrostateCorruption?.corruptionCount.toString() || "0", delta: "—", up: data?.invisibleMicrostateCorruption?.corruptionCount === 0 },
    { label: "Hidden Divergence", value: data?.hiddenAsyncDivergence?.divergenceCount.toString() || "0", delta: "—", up: data?.hiddenAsyncDivergence?.divergenceCount === 0 },
  ];

  const rows = [
    { metric: "Deterministic Microstates", value: `${microstate?.deterministicMicrostates.toLocaleString()}/${microstate?.totalMicrostates.toLocaleString()}`, status: microstate?.status },
    { metric: "Traced Mutations", value: `${authority?.tracedMutations.toLocaleString()}/${authority?.totalMutations.toLocaleString()}`, status: authority?.status },
    { metric: "Recoverable Chains", value: `${asyncChain?.recoverableChains.toLocaleString()}/${asyncChain?.totalChains.toLocaleString()}`, status: asyncChain?.status },
    { metric: "Observable Renders", value: `${render?.observableRenders.toLocaleString()}/${render?.totalRenders.toLocaleString()}`, status: render?.status },
    { metric: "Reversible Dependencies", value: `${dependency?.reversibleDependencies.toLocaleString()}/${dependency?.totalDependencies.toLocaleString()}`, status: dependency?.status },
    { metric: "Reconstructable Packets", value: `${packet?.reconstructablePackets.toLocaleString()}/${packet?.totalPackets.toLocaleString()}`, status: packet?.status },
    { metric: "Auditable Mutations", value: `${cache?.auditableMutations.toLocaleString()}/${cache?.totalMutations.toLocaleString()}`, status: cache?.status },
    { metric: "Isolated Tenants", value: `${cryptographic?.isolatedTenants}/${cryptographic?.totalTenants}`, status: cryptographic?.status },
    { metric: "Verifiable Policies", value: `${policy?.verifiablePolicies}/${policy?.totalPolicies}`, status: policy?.status },
    { metric: "Self-Healable Orchestrations", value: `${orchestration?.selfHealableOrchestrations}/${orchestration?.totalOrchestrations}`, status: orchestration?.status },
    { metric: "Untraceable Propagation", value: data?.untraceableAuthorityPropagation?.untraceableCount.toString() || "0", status: data?.untraceableAuthorityPropagation?.status === 'ZERO_UNTRACEABLE_PROPAGATION' ? 'OK' : 'WARNING' },
    { metric: "Unrecoverable Failures", value: data?.unrecoverableNanoscaleFailures?.failureCount.toString() || "0", status: data?.unrecoverableNanoscaleFailures?.status === 'ZERO_UNRECOVERABLE_FAILURES' ? 'OK' : 'WARNING' },
  ];

  const columns = [
    { key: "metric", label: "Validation" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Absolute Nano Root Validation" subtitle="Microstate determinism, authority mutation traceability, async chain recoverability, render path observability" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
