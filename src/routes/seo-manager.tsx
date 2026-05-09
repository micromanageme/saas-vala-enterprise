import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/seo-manager")({
  head: () => ({ meta: [{ title: "SEO Manager — SaaS Vala" }, { name: "description", content: "SEO operations management" }] }),
  component: Page,
});

function Page() {
  const { data: seoData, isLoading, error } = useQuery({
    queryKey: ["seo-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch SEO Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="SEO Manager" subtitle="SEO operations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load SEO Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Organic Traffic", value: "45.2K", delta: "+22%", up: true },
    { label: "Keywords Ranked", value: "1,234", delta: "+18%", up: true },
    { label: "Avg Position", value: "12.5", delta: "-2.3", up: true },
    { label: "Backlinks", value: "2,456", delta: "+15%", up: true },
  ];

  const columns = [
    { key: "keyword", label: "Keyword" },
    { key: "position", label: "Position" },
    { key: "volume", label: "Volume" },
    { key: "change", label: "Change" },
  ];

  const rows = [
    { keyword: "saas platform", position: "3", volume: "12K", change: "+2" },
    { keyword: "enterprise software", position: "5", volume: "8.5K", change: "+1" },
    { keyword: "business management", position: "7", volume: "15K", change: "+3" },
    { keyword: "crm software", position: "8", volume: "22K", change: "+4" },
    { keyword: "erp system", position: "12", volume: "18K", change: "+5" },
  ];

  return (
    <AppShell>
      <ModulePage title="SEO Manager" subtitle="SEO operations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
