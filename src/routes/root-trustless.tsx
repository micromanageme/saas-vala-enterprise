import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-trustless")({
  head: () => ({ meta: [{ title: "Universal Trustless Verification — Universal Access Admin" }, { name: "description", content: "Zero-trust validation chains, cryptographic proof verification, decentralized integrity" }] }),
  component: Page,
});

function Page() {
  const { data: trustlessData, isLoading, error } = useQuery({
    queryKey: ["root-trustless"],
    queryFn: async () => {
      const response = await fetch("/api/root/trustless-verification?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch trustless verification data");
      return response.json();
    },
    refetchInterval: 20000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Trustless Verification" subtitle="Zero-trust validation chains, cryptographic proof verification, decentralized integrity" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Trustless Verification data</div>
      </AppShell>
    );
  }

  const data = trustlessData?.data;
  const chains = data?.zeroTrustValidationChains;
  const proof = data?.cryptographicProofVerification;

  const kpis = [
    { label: "Validated Chains", value: `${chains?.validatedChains}/${chains?.totalChains}`, delta: "—", up: chains?.invalidChains === 0 },
    { label: "Verified Proofs", value: `${proof?.verifiedProofs}/${proof?.totalProofs}`, delta: "—", up: proof?.invalidProofs === 0 },
    { label: "Trust Score", value: data?.chainOfTrustOrchestration?.trustScore || "0%", delta: "—", up: data?.chainOfTrustOrchestration?.trustScore === '100%' },
  ];

  const rows = [
    { metric: "Chain Depth", value: chains?.chainDepth.toString() || "0", status: "OK" },
    { metric: "Proof Algorithm", value: proof?.proofAlgorithm || "—", status: "OK" },
    { metric: "Total Nodes", value: data?.decentralizedIntegrityValidation?.totalNodes.toString() || "0", status: "OK" },
    { metric: "Consensus Rate", value: data?.decentralizedIntegrityValidation?.consensusRate || "0%", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Trustless Verification" subtitle="Zero-trust validation chains, cryptographic proof verification, decentralized integrity" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
