import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-timeline")({
  head: () => ({ meta: [{ title: "Root Execution Timeline — Universal Access Admin" }, { name: "description", content: "Timeline replay, event chronology, audit reconstruction, forensic sequencing" }] }),
  component: Page,
});

function Page() {
  const { data: timelineData, isLoading, error } = useQuery({
    queryKey: ["root-timeline"],
    queryFn: async () => {
      const response = await fetch("/api/root/execution-timeline?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch execution timeline data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Execution Timeline" subtitle="Timeline replay, event chronology, audit reconstruction, forensic sequencing" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Execution Timeline data</div>
      </AppShell>
    );
  }

  const data = timelineData?.data;
  const timeline = data?.timeline || [];
  const replay = data?.timelineReplay;

  const kpis = replay ? [
    { label: "Total Events", value: replay.totalEvents.toLocaleString(), delta: "—", up: true },
    { label: "Replayable", value: replay.replayableEvents.toLocaleString(), delta: "—", up: true },
    { label: "Unreplayable", value: replay.unreplayableEvents.toString(), delta: "—", up: replay.unreplayableEvents === 0 },
  ] : [];

  const columns = [
    { key: "action", label: "Action" },
    { key: "entity", label: "Entity" },
    { key: "user", label: "User" },
    { key: "timestamp", label: "Timestamp" },
  ];

  const rows = timeline.slice(0, 20).map((t: any) => ({
    action: t.action,
    entity: t.entity,
    user: t.user,
    timestamp: new Date(t.timestamp).toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Root Execution Timeline" subtitle="Timeline replay, event chronology, audit reconstruction, forensic sequencing" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
