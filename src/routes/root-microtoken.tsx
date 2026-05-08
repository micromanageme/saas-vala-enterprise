import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-microtoken")({
  head: () => ({ meta: [{ title: "Micro Token Chain Validation — Universal Access Admin" }, { name: "description", content: "Token ancestry mapping, refresh lineage tracking, replay attack isolation" }] }),
  component: Page,
});

function Page() {
  const { data: tokenData, isLoading, error } = useQuery({
    queryKey: ["root-microtoken"],
    queryFn: async () => {
      const response = await fetch("/api/root/micro-token-validation?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch micro token validation data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Micro Token Chain Validation" subtitle="Token ancestry mapping, refresh lineage tracking, replay attack isolation" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Micro Token Chain Validation data</div>
      </AppShell>
    );
  }

  const data = tokenData?.data;
  const ancestry = data?.tokenAncestryMapping;
  const lineage = data?.refreshLineageTracking;

  const kpis = [
    { label: "Mapped Tokens", value: `${ancestry?.mappedTokens}/${ancestry?.totalTokens}`, delta: "—", up: ancestry?.unmappedTokens === 0 },
    { label: "Tracked Refreshes", value: `${lineage?.trackedRefreshes}/${lineage?.totalRefreshes}`, delta: "—", up: lineage?.untrackedRefreshes === 0 },
    { label: "Replay Attempts", value: data?.replayAttackIsolation?.replayAttempts.toString() || "0", delta: "—", up: data?.replayAttackIsolation?.replayAttempts === 0 },
  ] : [];

  const rows = [
    { metric: "Max Ancestry Depth", value: ancestry?.maxAncestryDepth.toString() || "0", status: "OK" },
    { metric: "Avg Lineage Length", value: lineage?.avgLineageLength.toString() || "0", status: "OK" },
    { metric: "Total Checks", value: data?.replayAttackIsolation?.totalChecks.toLocaleString() || "0", status: "OK" },
    { metric: "Terminated Chains", value: data?.invalidChainTermination?.terminatedChains.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Micro Token Chain Validation" subtitle="Token ancestry mapping, refresh lineage tracking, replay attack isolation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
