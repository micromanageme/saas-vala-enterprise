import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/social-media-manager")({
  head: () => ({ meta: [{ title: "Social Media Manager — SaaS Vala" }, { name: "description", content: "Social media management" }] }),
  component: Page,
});

function Page() {
  const { data: socialData, isLoading, error } = useQuery({
    queryKey: ["social-media-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Social Media Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Social Media Manager" subtitle="Social media management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Social Media Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total Followers", value: "45.2K", delta: "+12%", up: true },
    { label: "Engagement Rate", value: "4.8%", delta: "+0.5%", up: true },
    { label: "Posts This Week", value: "23", delta: "+5", up: true },
    { label: "Mentions", value: "156", delta: "+23", up: true },
  ];

  const columns = [
    { key: "platform", label: "Platform" },
    { key: "followers", label: "Followers" },
    { key: "engagement", label: "Engagement" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { platform: "LinkedIn", followers: "18.5K", engagement: "5.2%", status: "Active" },
    { platform: "Twitter", followers: "12.3K", engagement: "3.8%", status: "Active" },
    { platform: "Facebook", followers: "8.2K", engagement: "4.5%", status: "Active" },
    { platform: "Instagram", followers: "4.5K", engagement: "6.2%", status: "Active" },
    { platform: "YouTube", followers: "1.7K", engagement: "4.1%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Social Media Manager" subtitle="Social media management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
