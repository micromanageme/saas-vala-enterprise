import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-anticorruption")({
  head: () => ({ meta: [{ title: "Universal Anti-Corruption Layer — Universal Access Admin" }, { name: "description", content: "Schema corruption prevention, transactional corruption healing, runtime integrity" }] }),
  component: Page,
});

function Page() {
  const { data: corruptionData, isLoading, error } = useQuery({
    queryKey: ["root-anticorruption"],
    queryFn: async () => {
      const response = await fetch("/api/root/anti-corruption?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch anti-corruption data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Anti-Corruption Layer" subtitle="Schema corruption prevention, transactional corruption healing, runtime integrity" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Anti-Corruption Layer data</div>
      </AppShell>
    );
  }

  const data = corruptionData?.data;
  const schema = data?.schemaCorruptionPrevention;
  const transactional = data?.transactionalCorruptionHealing;

  const kpis = [
    { label: "Prevention Rate", value: schema?.preventionRate || "0%", delta: "—", up: schema?.preventionRate === '100%' },
    { label: "Healed Transactions", value: `${transactional?.healedTransactions.toLocaleString()}/${transactional?.totalTransactions.toLocaleString()}`, delta: "—", up: transactional?.corruptedTransactions === 0 },
    { label: "Enforcement Rate", value: data?.runtimeIntegrityEnforcement?.enforcementRate || "0%", delta: "—", up: data?.runtimeIntegrityEnforcement?.enforcementRate === '100%' },
  ];

  const rows = [
    { metric: "Total Schemas", value: schema?.totalSchemas.toString() || "0", status: "OK" },
    { metric: "Total Checks", value: data?.runtimeIntegrityEnforcement?.totalChecks.toLocaleString() || "0", status: "OK" },
    { metric: "Total Drifts", value: data?.driftNeutralizationEngine?.totalDrifts.toString() || "0", status: "OK" },
    { metric: "Neutralization Rate", value: data?.driftNeutralizationEngine?.neutralizationRate || "0%", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Anti-Corruption Layer" subtitle="Schema corruption prevention, transactional corruption healing, runtime integrity" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
