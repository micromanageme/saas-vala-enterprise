import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-quantumsecurity")({
  head: () => ({ meta: [{ title: "Root Quantum Security Layer — Universal Access Admin" }, { name: "description", content: "Post-quantum encryption readiness, quantum-safe key exchange, entropy verification" }] }),
  component: Page,
});

function Page() {
  const { data: quantumData, isLoading, error } = useQuery({
    queryKey: ["root-quantumsecurity"],
    queryFn: async () => {
      const response = await fetch("/api/root/quantum-security?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch quantum security data");
      return response.json();
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Quantum Security Layer" subtitle="Post-quantum encryption readiness, quantum-safe key exchange, entropy verification" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Quantum Security Layer data</div>
      </AppShell>
    );
  }

  const data = quantumData?.data;
  const readiness = data?.postQuantumReadiness;
  const resilience = data?.cryptographicResilience;

  const kpis = [
    { label: "Quantum Safe", value: readiness?.readinessPercentage || "0%", delta: "—", up: readiness?.readinessPercentage === '100%' },
    { label: "Safe Exchanges", value: data?.quantumSafeKeyExchange?.successfulExchanges.toString() || "0", delta: "—", up: true },
    { label: "Status", value: resilience?.status || "—", delta: "—", up: resilience?.status === 'QUANTUM_SAFE' },
  ];

  const rows = [
    { metric: "Total Keys", value: readiness?.totalKeys.toLocaleString() || "0", status: "OK" },
    { metric: "Quantum Safe Keys", value: readiness?.quantumSafeKeys.toLocaleString() || "0", status: "OK" },
    { metric: "Entropy Sources", value: data?.entropyVerification?.entropySources.toString() || "0", status: "OK" },
    { metric: "Entropy Quality", value: data?.entropyVerification?.entropyQuality || "—", status: "OK" },
    { metric: "Quantum Resistant Algorithms", value: resilience?.quantumResistantAlgorithms.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Quantum Security Layer" subtitle="Post-quantum encryption readiness, quantum-safe key exchange, entropy verification" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
