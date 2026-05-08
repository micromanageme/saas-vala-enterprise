import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-sentinel")({
  head: () => ({ meta: [{ title: "Universal Sentinel Network — Universal Access Admin" }, { name: "description", content: "Distributed guardian processes, watchdog intelligence, autonomous protection nodes" }] }),
  component: Page,
});

function Page() {
  const { data: sentinelData, isLoading, error } = useQuery({
    queryKey: ["root-sentinel"],
    queryFn: async () => {
      const response = await fetch("/api/root/sentinel-network?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch sentinel network data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Sentinel Network" subtitle="Distributed guardian processes, watchdog intelligence, autonomous protection nodes" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Sentinel Network data</div>
      </AppShell>
    );
  }

  const data = sentinelData?.data;
  const guardian = data?.distributedGuardianProcesses;
  const watchdog = data?.watchdogIntelligence;

  const kpis = [
    { label: "Active Guardians", value: `${guardian?.activeGuardians}/${guardian?.totalGuardians}`, delta: "—", up: true },
    { label: "Guardian Coverage", value: guardian?.guardianCoverage || "0%", delta: "—", up: guardian?.guardianCoverage === '100%' },
    { label: "Protection Level", value: data?.autonomousProtectionNodes?.protectionLevel || "—", delta: "—", up: data?.autonomousProtectionNodes?.protectionLevel === 'CRITICAL' },
  ] : [];

  const rows = [
    { metric: "Total Watchdogs", value: watchdog?.totalWatchdogs.toString() || "0", status: "OK" },
    { metric: "Alerts Generated", value: watchdog?.alertsGenerated.toString() || "0", status: "OK" },
    { metric: "False Alerts", value: watchdog?.falseAlerts.toString() || "0", status: "OK" },
    { metric: "Total Agents", value: data?.realtimeContainmentAgents?.totalAgents.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Sentinel Network" subtitle="Distributed guardian processes, watchdog intelligence, autonomous protection nodes" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
