import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-microstorage")({
  head: () => ({ meta: [{ title: "Micro Storage Integrity Engine — Universal Access Admin" }, { name: "description", content: "Write-corruption validation, fragmented state healing, storage entropy monitoring" }] }),
  component: Page,
});

function Page() {
  const { data: storageData, isLoading, error } = useQuery({
    queryKey: ["root-microstorage"],
    queryFn: async () => {
      const response = await fetch("/api/root/micro-storage-integrity?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch micro storage integrity data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Micro Storage Integrity Engine" subtitle="Write-corruption validation, fragmented state healing, storage entropy monitoring" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Micro Storage Integrity Engine data</div>
      </AppShell>
    );
  }

  const data = storageData?.data;
  const validation = data?.writeCorruptionValidation;
  const healing = data?.fragmentedStateHealing;

  const kpis = [
    { label: "Validation Rate", value: validation?.validationRate || "0%", delta: "—", up: validation?.validationRate === '100%' },
    { label: "Healing Rate", value: healing?.healingRate || "0%", delta: "—", up: healing?.healingRate === '100%' },
    { label: "Entropy Score", value: data?.storageEntropyMonitoring?.entropyScore || "—", delta: "—", up: parseFloat(data?.storageEntropyMonitoring?.entropyScore || '0') > 8 },
  ];

  const rows = [
    { metric: "Total Writes", value: validation?.totalWrites.toLocaleString() || "0", status: "OK" },
    { metric: "Total Healings", value: healing?.totalHealings.toString() || "0", status: "OK" },
    { metric: "Degraded Storage", value: data?.storageEntropyMonitoring?.degradedStorage.toString() || "0", status: "OK" },
    { metric: "Repaired Objects", value: data?.objectConsistencyRepair?.repairedObjects.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Micro Storage Integrity Engine" subtitle="Write-corruption validation, fragmented state healing, storage entropy monitoring" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
