import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/media-broadcast-manager")({
  head: () => ({ meta: [{ title: "Media Broadcast Manager — SaaS Vala" }, { name: "description", content: "Media broadcast management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: mediaData, isLoading, error } = useQuery({
    queryKey: ["media-broadcast-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Media Broadcast Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Media Broadcast Manager" subtitle="Media broadcast management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Media Broadcast Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Channels", value: "8", delta: "+1", up: true },
    { label: "Viewership", value: "2.5M", delta: "+200K", up: true },
    { label: "Broadcast Hours", value: "180", delta: "+15", up: true },
    { label: "Ad Revenue", value: "$450K", delta: "+$50K", up: true },
  ];

  const columns = [
    { key: "channel", label: "Broadcast Channel" },
    { key: "format", label: "Format" },
    { key: "audience", label: "Daily Audience" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { channel: "Channel 1 - News", format: "24/7", audience: "500K", status: "On Air" },
    { channel: "Channel 2 - Sports", format: "24/7", audience: "800K", status: "On Air" },
    { channel: "Channel 3 - Entertainment", format: "24/7", audience: "650K", status: "On Air" },
    { channel: "Channel 4 - Documentary", format: "Scheduled", audience: "350K", status: "On Air" },
    { channel: "Channel 5 - Music", format: "24/7", audience: "200K", status: "On Air" },
  ];

  return (
    <AppShell>
      <ModulePage title="Media Broadcast Manager" subtitle="Media broadcast management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
