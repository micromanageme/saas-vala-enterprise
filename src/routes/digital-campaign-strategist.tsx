import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/digital-campaign-strategist")({
  head: () => ({ meta: [{ title: "Digital Campaign Strategist — SaaS Vala" }, { name: "description", content: "Digital campaign strategy workspace" }] }),
  component: Page,
});

function Page() {
  const { data: campaignData, isLoading, error } = useQuery({
    queryKey: ["digital-campaign-strategist-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Digital Campaign Strategist data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Digital Campaign Strategist" subtitle="Digital campaign strategy workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Digital Campaign Strategist data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Campaigns Running", value: "15", delta: "+2", up: true },
    { label: "Reach", value: "5M", delta: "+500K", up: true },
    { label: "Conversion Rate", value: "3.5%", delta: "+0.3%", up: true },
    { label: "CTR", value: "2.2%", delta: "+0.2%", up: true },
  ];

  const columns = [
    { key: "campaign", label: "Campaign" },
    { key: "channel", label: "Channel" },
    { key: "budget", label: "Budget" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { campaign: "CMP-001", channel: "Social Media", budget: "$50K", status: "Active" },
    { campaign: "CMP-002", channel: "Search", budget: "$30K", status: "Active" },
    { campaign: "CMP-003", channel: "Display", budget: "$20K", status: "Active" },
    { campaign: "CMP-004", channel: "Email", budget: "$10K", status: "Paused" },
    { campaign: "CMP-005", channel: "Video", budget: "$40K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Digital Campaign Strategist" subtitle="Digital campaign strategy workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
