import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/event-ceremony-coordinator")({
  head: () => ({ meta: [{ title: "Event Ceremony Coordinator — SaaS Vala" }, { name: "description", content: "Event ceremony coordination workspace" }] }),
  component: Page,
});

function Page() {
  const { data: ceremonyData, isLoading, error } = useQuery({
    queryKey: ["event-ceremony-coordinator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Event Ceremony Coordinator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Event Ceremony Coordinator" subtitle="Event ceremony coordination workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Event Ceremony Coordinator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Events Organized", value: "35", delta: "+5", up: true },
    { label: "Attendees", value: "3.5K", delta: "+300", up: true },
    { label: "Success Rate", value: "95%", delta: "+2%", up: true },
    { label: "Satisfaction", value: "4.7/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "event", label: "Event" },
    { key: "type", label: "Type" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { event: "EVT-001", type: "Wedding", date: "2024-06-20", status: "Planned" },
    { event: "EVT-002", type: "Funeral", date: "2024-06-21", status: "Completed" },
    { event: "EVT-003", type: "Festival", date: "2024-06-25", status: "In Progress" },
    { event: "EVT-004", type: "Religious Ceremony", date: "2024-07-01", status: "Planned" },
    { event: "EVT-005", type: "Conference", date: "2024-07-10", status: "Planning" },
  ];

  return (
    <AppShell>
      <ModulePage title="Event Ceremony Coordinator" subtitle="Event ceremony coordination workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
