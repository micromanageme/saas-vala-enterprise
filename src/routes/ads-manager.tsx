import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ads-manager")({
  head: () => ({ meta: [{ title: "Ads Manager — SaaS Vala" }, { name: "description", content: "Advertising management" }] }),
  component: Page,
});

function Page() {
  const { data: adsData, isLoading, error } = useQuery({
    queryKey: ["ads-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Ads Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Ads Manager" subtitle="Advertising management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Ads Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Campaigns", value: "12", delta: "+2", up: true },
    { label: "Total Spend", value: "$25K", delta: "+8%", up: false },
    { label: "ROAS", value: "4.5x", delta: "+0.5x", up: true },
    { label: "Click Rate", value: "2.8%", delta: "+0.3%", up: true },
  ];

  const columns = [
    { key: "campaign", label: "Campaign" },
    { key: "platform", label: "Platform" },
    { key: "spend", label: "Spend" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { campaign: "Q3 Brand Awareness", platform: "Google Ads", spend: "$8,500", status: "Active" },
    { campaign: "Product Launch", platform: "Facebook", spend: "$6,200", status: "Active" },
    { campaign: "Retargeting", platform: "LinkedIn", spend: "$4,800", status: "Active" },
    { campaign: "YouTube Ads", platform: "YouTube", spend: "$3,500", status: "Paused" },
    { campaign: "Display Network", platform: "Google", spend: "$2,000", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Ads Manager" subtitle="Advertising management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
