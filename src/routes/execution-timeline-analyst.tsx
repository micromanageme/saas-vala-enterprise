import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/execution-timeline-analyst")({
  head: () => ({ meta: [{ title: "Execution Timeline Analyst — SaaS Vala" }, { name: "description", content: "Execution timeline analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: timelineData, isLoading, error } = useQuery({
    queryKey: ["execution-timeline-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Execution Timeline Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Execution Timeline Analyst" subtitle="Execution timeline analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Execution Timeline Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Events Tracked", value: "2.5M", delta: "+250K", up: true },
    { label: "Timelines Reconstructed", value: "125", delta: "+15", up: true },
    { label: "Accuracy", value: "96%", delta: "+2%", up: true },
    { label: "Latency", value: "5ms", delta: "-1ms", up: true },
  ];

  const columns = [
    { key: "timeline", label: "Timeline ID" },
    { key: "system", label: "System" },
    { key: "events", label: "Events" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { timeline: "TL-001", system: "Payment", events: "5K", status: "Reconstructed" },
    { timeline: "TL-002", system: "User", events: "3K", status: "Reconstructed" },
    { timeline: "TL-003", system: "Order", events: "8K", status: "In Progress" },
    { timeline: "TL-004", system: "Auth", events: "2K", status: "Reconstructed" },
    { timeline: "TL-005", system: "Inventory", events: "4K", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="Execution Timeline Analyst" subtitle="Execution timeline analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
