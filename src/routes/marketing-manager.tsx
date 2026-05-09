import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/marketing-manager")({
  head: () => ({ meta: [{ title: "Marketing Manager — SaaS Vala" }, { name: "description", content: "Marketing team management" }] }),
  component: Page,
});

function Page() {
  const { data: mktData, isLoading, error } = useQuery({
    queryKey: ["marketing-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Marketing Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Marketing Manager" subtitle="Marketing team management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Marketing Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Campaigns Active", value: "12", delta: "+2", up: true },
    { label: "Leads Generated", value: "1,234", delta: "+18%", up: true },
    { label: "Marketing ROI", value: "320%", delta: "+15%", up: true },
    { label: "Brand Awareness", value: "78%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "campaign", label: "Campaign" },
    { key: "channel", label: "Channel" },
    { key: "budget", label: "Budget" },
    { key: "roi", label: "ROI" },
  ];

  const rows = [
    { campaign: "Q3 Product Launch", channel: "Multi", budget: "$50K", roi: "450%" },
    { campaign: "SEO Initiative", channel: "Organic", budget: "$15K", roi: "520%" },
    { campaign: "Social Media Push", channel: "Social", budget: "$25K", roi: "320%" },
    { campaign: "Email Nurture", channel: "Email", budget: "$10K", roi: "680%" },
    { campaign: "Paid Search", channel: "PPC", budget: "$30K", roi: "280%" },
  ];

  return (
    <AppShell>
      <ModulePage title="Marketing Manager" subtitle="Marketing team management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
