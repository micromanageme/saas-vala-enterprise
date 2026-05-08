import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-shadowdetector")({
  head: () => ({ meta: [{ title: "Universal Shadow System Detector — Universal Access Admin" }, { name: "description", content: "Hidden process detection, rogue service discovery, unauthorized dependency discovery" }] }),
  component: Page,
});

function Page() {
  const { data: shadowData, isLoading, error } = useQuery({
    queryKey: ["root-shadowdetector"],
    queryFn: async () => {
      const response = await fetch("/api/root/shadow-system-detector?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch shadow system detector data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Shadow System Detector" subtitle="Hidden process detection, rogue service discovery, unauthorized dependency discovery" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Shadow System Detector data</div>
      </AppShell>
    );
  }

  const data = shadowData?.data;
  const process = data?.hiddenProcessDetection;
  const service = data?.rogueServiceDiscovery;

  const kpis = [
    { label: "Hidden Processes", value: process?.hiddenProcessesFound.toString() || "0", delta: "—", up: process?.hiddenProcessesFound === 0 },
    { label: "Rogue Services", value: service?.rogueServices.toString() || "0", delta: "—", up: service?.rogueServices === 0 },
    { label: "Phantom States", value: data?.phantomStateIsolation?.phantomStates.toString() || "0", delta: "—", up: data?.phantomStateIsolation?.phantomStates === 0 },
  ] : [];

  const rows = [
    { metric: "Total Scans", value: process?.totalScans.toString() || "0", status: "OK" },
    { metric: "Total Services", value: service?.totalServices.toString() || "0", status: "OK" },
    { metric: "Total Dependencies", value: data?.unauthorizedDependencyDiscovery?.totalDependencies.toString() || "0", status: "OK" },
    { metric: "Status", value: data?.phantomStateIsolation?.status || "—", status: data?.phantomStateIsolation?.status === 'CLEAN' ? 'OK' : 'WARNING' },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Shadow System Detector" subtitle="Hidden process detection, rogue service discovery, unauthorized dependency discovery" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
