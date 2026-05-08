import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/streaming-manager")({
  head: () => ({ meta: [{ title: "Streaming Manager — SaaS Vala" }, { name: "description", content: "Streaming management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: streamingData, isLoading, error } = useQuery({
    queryKey: ["streaming-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Streaming Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Streaming Manager" subtitle="Streaming management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Streaming Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Streams", value: "25", delta: "+3", up: true },
    { label: "Concurrent Viewers", value: "125K", delta: "+15K", up: true },
    { label: "Bandwidth Used", value: "45 Gbps", delta: "+5 Gbps", up: true },
    { label: "Stream Quality", value: "HD", delta: "—", up: true },
  ];

  const columns = [
    { key: "stream", label: "Stream" },
    { key: "viewers", label: "Current Viewers" },
    { key: "quality", label: "Quality" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { stream: "Live News", viewers: "45K", quality: "1080p", status: "Live" },
    { stream: "Sports Event", viewers: "35K", quality: "4K", status: "Live" },
    { stream: "Music Channel", viewers: "25K", quality: "720p", status: "Live" },
    { stream: "Documentary", viewers: "12K", quality: "1080p", status: "VOD" },
    { stream: "Gaming Stream", viewers: "8K", quality: "720p", status: "Live" },
  ];

  return (
    <AppShell>
      <ModulePage title="Streaming Manager" subtitle="Streaming management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
