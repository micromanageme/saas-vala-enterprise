import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — SaaS Vala" }, { name: "description", content: "Schedule & events" }] }),
  component: Page,
});

function Page() {
  const { data: calendarData, isLoading, error } = useQuery({
    queryKey: ["calendar"],
    queryFn: async () => {
      const response = await fetch("/api/calendar?type=all");
      if (!response.ok) throw new Error("Failed to fetch Calendar data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Calendar" subtitle="Schedule & events" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Calendar data</div>
      </AppShell>
    );
  }

  const data = calendarData?.data;
  const kpis = data?.kpis ? [
    { label: "Today Events", value: data.kpis.todayEvents.toString(), delta: `+${data.kpis.todayEventsDelta}`, up: data.kpis.todayEventsDelta > 0 },
    { label: "Upcoming", value: data.kpis.upcoming.toString(), delta: `+${data.kpis.upcomingDelta}`, up: data.kpis.upcomingDelta > 0 },
    { label: "Meetings", value: data.kpis.meetings.toString(), delta: `+${data.kpis.meetingsDelta}`, up: data.kpis.meetingsDelta > 0 },
    { label: "Conflicts", value: data.kpis.conflicts.toString(), delta: `${data.kpis.conflictsDelta}`, up: data.kpis.conflictsDelta < 0 }
  ];

  const columns = [{ key: "title", label: "Event" }, { key: "type", label: "Type" }, { key: "start", label: "Start" }, { key: "status", label: "Status" }];
  const rows = data?.events?.map((e: any) => ({
    title: e.title,
    type: e.type,
    start: new Date(e.start).toLocaleString(),
    status: e.status
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Calendar" subtitle="Schedule & events" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
