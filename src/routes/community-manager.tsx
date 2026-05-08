import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/community-manager")({
  head: () => ({ meta: [{ title: "Community Manager — SaaS Vala" }, { name: "description", content: "Community management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: communityData, isLoading, error } = useQuery({
    queryKey: ["community-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Community Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Community Manager" subtitle="Community management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Community Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Community Members", value: "12.5K", delta: "+1.2K", up: true },
    { label: "Active Users", value: "3.2K", delta: "+300", up: true },
    { label: "Engagement Rate", value: "68%", delta: "+5%", up: true },
    { label: "Contributors", value: "450", delta: "+50", up: true },
  ];

  const columns = [
    { key: "channel", label: "Community Channel" },
    { key: "members", label: "Members" },
    { key: "activity", label: "Activity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { channel: "Discord Server", members: "8.5K", activity: "High", status: "Active" },
    { channel: "Slack Community", members: "2.8K", activity: "Medium", status: "Active" },
    { channel: "Forum", members: "1.2K", activity: "Low", status: "Active" },
    { channel: "GitHub Discussions", members: "5.5K", activity: "High", status: "Active" },
    { channel: "Twitter/X", members: "3.2K", activity: "Medium", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Community Manager" subtitle="Community management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
