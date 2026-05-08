import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/cmo")({
  head: () => ({ meta: [{ title: "CMO Dashboard — SaaS Vala" }, { name: "description", content: "Chief Marketing Officer - Marketing oversight" }] }),
  component: Page,
});

function Page() {
  const { data: cmoData, isLoading, error } = useQuery({
    queryKey: ["cmo-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch CMO data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="CMO Dashboard" subtitle="Chief Marketing Officer - Marketing oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load CMO data</div>
      </AppShell>
    );
  }

  const data = cmoData?.analytics;
  const kpis = data ? [
    { label: "Total Leads", value: data.marketplace?.totalVendors?.toLocaleString() || "0", delta: "+12%", up: true },
    { label: "Conversion Rate", value: "4.5%", delta: "+0.8%", up: true },
    { label: "Marketing ROI", value: "320%", delta: "+15%", up: true },
    { label: "Brand Awareness", value: "78%", delta: "+5%", up: true },
  ] : [];

  const columns = [
    { key: "channel", label: "Channel" },
    { key: "leads", label: "Leads" },
    { key: "conversion", label: "Conversion" },
    { key: "roi", label: "ROI" },
  ];

  const rows = [
    { channel: "Organic Search", leads: "2,450", conversion: "5.2%", roi: "450%" },
    { channel: "Paid Ads", leads: "1,890", conversion: "3.8%", roi: "280%" },
    { channel: "Social Media", leads: "1,234", conversion: "4.1%", roi: "320%" },
    { channel: "Email Marketing", leads: "987", conversion: "6.5%", roi: "520%" },
    { channel: "Referral", leads: "654", conversion: "8.2%", roi: "680%" },
  ];

  return (
    <AppShell>
      <ModulePage title="CMO Dashboard" subtitle="Chief Marketing Officer - Marketing oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
