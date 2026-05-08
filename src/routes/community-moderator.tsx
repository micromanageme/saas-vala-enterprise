import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/community-moderator")({
  head: () => ({ meta: [{ title: "Community Moderator — SaaS Vala" }, { name: "description", content: "Community moderation workspace" }] }),
  component: Page,
});

function Page() {
  const { data: communityData, isLoading, error } = useQuery({
    queryKey: ["community-moderator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Community Moderator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Community Moderator" subtitle="Community moderation workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Community Moderator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Posts Moderated", value: "1.2K", delta: "+150", up: true },
    { label: "Violations Removed", value: "45", delta: "-5", up: true },
    { label: "Response Time", value: "15min", delta: "-5min", up: true },
    { label: "Community Health", value: "92%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "community", label: "Community" },
    { key: "members", label: "Members" },
    { key: "activity", label: "Daily Activity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { community: "COM-001", members: "50K", activity: "5K", status: "Active" },
    { community: "COM-002", members: "30K", activity: "3K", status: "Active" },
    { community: "COM-003", members: "20K", activity: "2K", status: "Active" },
    { community: "COM-004", members: "15K", activity: "1K", status: "Moderated" },
    { community: "COM-005", members: "10K", activity: "500", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Community Moderator" subtitle="Community moderation workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
