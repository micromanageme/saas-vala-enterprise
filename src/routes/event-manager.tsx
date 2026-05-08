import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/event-manager")({
  head: () => ({ meta: [{ title: "Event Manager — SaaS Vala" }, { name: "description", content: "Event management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: eventData, isLoading, error } = useQuery({
    queryKey: ["event-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Event Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Event Manager" subtitle="Event management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Event Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Events Managed", value: "25", delta: "+3", up: true },
    { label: "Attendees", value: "5.2K", delta: "+500", up: true },
    { label: "Success Rate", value: "96%", delta: "+2%", up: true },
    { label: "Client Satisfaction", value: "4.7/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "event", label: "Event" },
    { key: "type", label: "Type" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { event: "EVT-001", type: "Conference", date: "2024-07-15", status: "Planning" },
    { event: "EVT-002", type: "Wedding", date: "2024-06-20", status: "In Progress" },
    { event: "EVT-003", type: "Corporate", date: "2024-08-10", status: "Planning" },
    { event: "EVT-004", type: "Concert", date: "2024-06-25", status: "Confirmed" },
    { event: "EVT-005", type: "Exhibition", date: "2024-09-05", status: "Planning" },
  ];

  return (
    <AppShell>
      <ModulePage title="Event Manager" subtitle="Event management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
