import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-interoperability")({
  head: () => ({ meta: [{ title: "Root Interoperability Fabric — Universal Access Admin" }, { name: "description", content: "Cross-platform orchestration, protocol translation, legacy-modern bridge" }] }),
  component: Page,
});

function Page() {
  const { data: interoperabilityData, isLoading, error } = useQuery({
    queryKey: ["root-interoperability"],
    queryFn: async () => {
      const response = await fetch("/api/root/interoperability-fabric?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch interoperability fabric data");
      return response.json();
    },
    refetchInterval: 20000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Interoperability Fabric" subtitle="Cross-platform orchestration, protocol translation, legacy-modern bridge" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Interoperability Fabric data</div>
      </AppShell>
    );
  }

  const data = interoperabilityData?.data;
  const orchestration = data?.crossPlatformOrchestration;
  const translation = data?.protocolTranslation;

  const kpis = [
    { label: "Integrated Platforms", value: `${orchestration?.integratedPlatforms}/${orchestration?.totalPlatforms}`, delta: "—", up: true },
    { label: "Success Rate", value: orchestration?.orchestrationSuccessRate || "0%", delta: "—", up: parseFloat(orchestration?.orchestrationSuccessRate || '0') > 99 },
    { label: "Supported Translations", value: translation?.supportedTranslations.toString() || "0", delta: "—", up: true },
  ];

  const rows = [
    { metric: "Total Platforms", value: orchestration?.totalPlatforms.toString() || "0", status: "OK" },
    { metric: "Total Protocols", value: translation?.totalProtocols.toString() || "0", status: "OK" },
    { metric: "Legacy Systems", value: data?.legacyModernBridge?.totalLegacySystems.toString() || "0", status: "OK" },
    { metric: "Bridged Systems", value: data?.legacyModernBridge?.bridgedSystems.toString() || "0", status: "OK" },
    { metric: "Total Ecosystems", value: data?.federatedEcosystemConnectivity?.totalEcosystems.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Interoperability Fabric" subtitle="Cross-platform orchestration, protocol translation, legacy-modern bridge" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
