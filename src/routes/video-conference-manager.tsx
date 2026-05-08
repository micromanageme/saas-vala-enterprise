import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/video-conference-manager")({
  head: () => ({ meta: [{ title: "Video Conference Manager — SaaS Vala" }, { name: "description", content: "Video conference management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: videoData, isLoading, error } = useQuery({
    queryKey: ["video-conference-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Video Conference Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Video Conference Manager" subtitle="Video conference management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Video Conference Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Meetings Today", value: "150", delta: "+15", up: true },
    { label: "Participants", value: "2.5K", delta: "+250", up: true },
    { label: "Video Quality", value: "4.7/5", delta: "+0.1", up: true },
    { label: "Bandwidth Used", value: "10GB", delta: "+1GB", up: true },
  ];

  const columns = [
    { key: "meeting", label: "Video Meeting" },
    { key: "host", label: "Host" },
    { key: "participants", label: "Participants" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { meeting: "MTG-001", host: "Host A", participants: "25", status: "In Progress" },
    { meeting: "MTG-002", host: "Host B", participants: "15", status: "Scheduled" },
    { meeting: "MTG-003", host: "Host C", participants: "30", status: "Completed" },
    { meeting: "MTG-004", host: "Host D", participants: "10", status: "In Progress" },
    { meeting: "MTG-005", host: "Host E", participants: "20", status: "Scheduled" },
  ];

  return (
    <AppShell>
      <ModulePage title="Video Conference Manager" subtitle="Video conference management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
