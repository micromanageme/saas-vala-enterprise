import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-nanoservicehealth")({
  head: () => ({ meta: [{ title: "Nano Service Health Propagation — Universal Access Admin" }, { name: "description", content: "Cascading degradation mapping, partial-failure isolation, dependency health synthesis" }] }),
  component: Page,
});

function Page() {
  const { data: healthData, isLoading, error } = useQuery({
    queryKey: ["root-nanoservicehealth"],
    queryFn: async () => {
      const response = await fetch("/api/root/nano-service-health?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch nano service health data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Nano Service Health Propagation" subtitle="Cascading degradation mapping, partial-failure isolation, dependency health synthesis" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Nano Service Health Propagation data</div>
      </AppShell>
    );
  }

  const data = healthData?.data;
  const degradation = data?.cascadingDegradationMapping;
  const isolation = data?.partialFailureIsolation;

  const kpis = [
    { label: "Degraded Services", value: degradation?.degradedServices.toString() || "0", delta: "—", up: degradation?.degradedServices === 0 },
    { label: "Isolation Rate", value: isolation?.isolationRate || "0%", delta: "—", up: isolation?.isolationRate === '100%' },
    { label: "Quarantine Rate", value: data?.unstableNodeQuarantine?.quarantineRate || "0%", delta: "—", up: data?.unstableNodeQuarantine?.quarantineRate === '0' },
  ] : [];

  const rows = [
    { metric: "Total Services", value: degradation?.totalServices.toString() || "0", status: "OK" },
    { metric: "Total Failures", value: isolation?.totalFailures.toString() || "0", status: "OK" },
    { metric: "Healthy Dependencies", value: data?.dependencyHealthSynthesis?.healthyDependencies.toString() || "0", status: "OK" },
    { metric: "Active Nodes", value: data?.unstableNodeQuarantine?.activeNodes.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Nano Service Health Propagation" subtitle="Cascading degradation mapping, partial-failure isolation, dependency health synthesis" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
