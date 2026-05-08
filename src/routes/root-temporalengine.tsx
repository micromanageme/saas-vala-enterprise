import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-temporalengine")({
  head: () => ({ meta: [{ title: "Universal Temporal Engine — Universal Access Admin" }, { name: "description", content: "Historical state replay, point-in-time restoration, timeline branching" }] }),
  component: Page,
});

function Page() {
  const { data: temporalData, isLoading, error } = useQuery({
    queryKey: ["root-temporalengine"],
    queryFn: async () => {
      const response = await fetch("/api/root/temporal-engine?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch temporal engine data");
      return response.json();
    },
    refetchInterval: 20000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Temporal Engine" subtitle="Historical state replay, point-in-time restoration, timeline branching" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Temporal Engine data</div>
      </AppShell>
    );
  }

  const data = temporalData?.data;
  const replays = data?.stateReplay || [];
  const restoration = data?.pointInTimeRestoration;

  const kpis = restoration ? [
    { label: "Total Snapshots", value: restoration.totalSnapshots.toLocaleString(), delta: "—", up: true },
    { label: "Restorable", value: restoration.restorableSnapshots.toLocaleString(), delta: "—", up: true },
    { label: "Retention Days", value: restoration.retentionDays.toString(), delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "type", label: "Type" },
    { key: "timestamp", label: "Timestamp" },
    { key: "duration", label: "Duration" },
    { key: "success", label: "Success" },
  ];

  const rows = replays.map((r: any) => ({
    type: r.type,
    timestamp: new Date(r.timestamp).toLocaleString(),
    duration: r.duration + "s",
    success: r.success ? "Yes" : "No",
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Temporal Engine" subtitle="Historical state replay, point-in-time restoration, timeline branching" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
