import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/affiliate-manager")({
  head: () => ({ meta: [{ title: "Affiliate Manager — SaaS Vala" }, { name: "description", content: "Affiliate management" }] }),
  component: Page,
});

function Page() {
  const { data: affiliateData, isLoading, error } = useQuery({
    queryKey: ["affiliate-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Affiliate Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Affiliate Manager" subtitle="Affiliate management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Affiliate Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Affiliates", value: "45", delta: "+8", up: true },
    { label: "Referrals", value: "234", delta: "+45", up: true },
    { label: "Commission Paid", value: "$8.5K", delta: "+$1.2K", up: true },
    { label: "Conversion Rate", value: "12%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "affiliate", label: "Affiliate" },
    { key: "referrals", label: "Referrals" },
    { key: "conversions", label: "Conversions" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { affiliate: "TechBlog", referrals: "45", conversions: "8", status: "Active" },
    { affiliate: "ReviewSite", referrals: "32", conversions: "5", status: "Active" },
    { affiliate: "YouTubeChannel", referrals: "28", conversions: "4", status: "Active" },
    { affiliate: "Influencer", referrals: "18", conversions: "3", status: "Active" },
    { affiliate: "Forum", referrals: "12", conversions: "2", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Affiliate Manager" subtitle="Affiliate management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
