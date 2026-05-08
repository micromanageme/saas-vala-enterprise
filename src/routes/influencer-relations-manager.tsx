import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/influencer-relations-manager")({
  head: () => ({ meta: [{ title: "Influencer Relations Manager — SaaS Vala" }, { name: "description", content: "Influencer relations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: influencerData, isLoading, error } = useQuery({
    queryKey: ["influencer-relations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Influencer Relations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Influencer Relations Manager" subtitle="Influencer relations management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Influencer Relations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Influencers Managed", value: "125", delta: "+15", up: true },
    { label: "Campaigns Active", value: "25", delta: "+3", up: true },
    { label: "Engagement Rate", value: "8.5%", delta: "+0.5%", up: true },
    { label: "ROI", value: "320%", delta: "+20%", up: true },
  ];

  const columns = [
    { key: "influencer", label: "Influencer" },
    { key: "platform", label: "Platform" },
    { key: "followers", label: "Followers" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { influencer: "INF-001", platform: "Instagram", followers: "1M", status: "Active" },
    { influencer: "INF-002", platform: "YouTube", followers: "500K", status: "Active" },
    { influencer: "INF-003", platform: "TikTok", followers: "2M", status: "Active" },
    { influencer: "INF-004", platform: "Twitter", followers: "300K", status: "Paused" },
    { influencer: "INF-005", platform: "LinkedIn", followers: "100K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Influencer Relations Manager" subtitle="Influencer relations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
