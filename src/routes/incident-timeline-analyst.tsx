import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/incident-timeline-analyst")({
  head: () => ({ meta: [{ title: "Incident Timeline Analyst — SaaS Vala" }, { name: "description", content: "Incident timeline analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: timelineData, isLoading, error } = useQuery({
    queryKey: ["incident-timeline-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Incident Timeline Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Incident Timeline Analyst" subtitle="Incident timeline analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Incident Timeline Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Timelines Built", value: "45", delta: "+5", up: true },
    { label: "Accuracy", value: "94%", delta: "+2%", up: true },
    { label: "Events Tracked", value: "10K", delta: "+1K", up: true },
    { label: "Resolution Support", value: "90%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "timeline", label: "Incident Timeline" },
    { key: "incident", label: "Incident" },
    { key: "events", label: "Events" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { timeline: "TLN-001", incident: "INC-001", events: "250", status: "Completed" },
    { timeline: "TLN-002", incident: "INC-002", events: "180", status: "In Progress" },
    { timeline: "TLN-003", incident: "INC-003", events: "300", status: "Completed" },
    { timeline: "TLN-004", incident: "INC-004", events: "150", status: "In Progress" },
    { timeline: "TLN-005", incident: "INC-005", events: "200", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Incident Timeline Analyst" subtitle="Incident timeline analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
