import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-statesync")({
  head: () => ({ meta: [{ title: "Root State Synchronizer — Universal Access Admin" }, { name: "description", content: "Cross-tab sync, cross-device sync, realtime propagation, stale state cleanup" }] }),
  component: Page,
});

function Page() {
  const { data: syncData, isLoading, error } = useQuery({
    queryKey: ["root-statesync"],
    queryFn: async () => {
      const response = await fetch("/api/root/state-synchronizer?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch state synchronizer data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root State Synchronizer" subtitle="Cross-tab sync, cross-device sync, realtime propagation, stale state cleanup" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root State Synchronizer data</div>
      </AppShell>
    );
  }

  const data = syncData?.data;
  const sync = data?.realtimeSync;
  const device = data?.crossDeviceSync;

  const kpis = [
    { label: "Active Channels", value: `${sync?.activeChannels}/${sync?.totalSyncChannels}`, delta: "—", up: true },
    { label: "Messages/s", value: sync?.messagesPerSecond.toString() || "0", delta: "—", up: true },
    { label: "Synced Users", value: `${device?.syncedUsers}/${device?.totalUsers}`, delta: "—", up: true },
  ] : [];

  const rows = [
    { metric: "Total Sync Channels", value: sync?.totalSyncChannels.toString() || "0", status: "OK" },
    { metric: "Active Channels", value: sync?.activeChannels.toString() || "0", status: "OK" },
    { metric: "Messages Per Second", value: sync?.messagesPerSecond.toString() || "0", status: "OK" },
    { metric: "Total Users", value: device?.totalUsers.toString() || "0", status: "OK" },
    { metric: "Synced Users", value: device?.syncedUsers.toString() || "0", status: "OK" },
    { metric: "Stale States", value: data?.staleStateCleanup?.staleStates.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root State Synchronizer" subtitle="Cross-tab sync, cross-device sync, realtime propagation, stale state cleanup" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
