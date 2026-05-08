import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/social-listening-analyst")({
  head: () => ({ meta: [{ title: "Social Listening Analyst — SaaS Vala" }, { name: "description", content: "Social listening analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: socialData, isLoading, error } = useQuery({
    queryKey: ["social-listening-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Social Listening Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Social Listening Analyst" subtitle="Social listening analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Social Listening Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Conversations Tracked", value: "50K", delta: "+5K", up: true },
    { label: "Trends Identified", value: "25", delta: "+3", up: true },
    { label: "Insights Generated", value: "45", delta: "+5", up: true },
    { label: "Coverage", value: "85%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "topic", label: "Trending Topic" },
    { key: "volume", label: "Volume" },
    { key: "sentiment", label: "Sentiment" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { topic: "Product Launch", volume: "5K", sentiment: "Positive", status: "Rising" },
    { topic: "Competitor News", volume: "3K", sentiment: "Neutral", status: "Stable" },
    { topic: "Industry Trend", volume: "8K", sentiment: "Positive", status: "Rising" },
    { topic: "Brand Issue", volume: "2K", sentiment: "Negative", status: "Declining" },
    { topic: "Customer Feedback", volume: "4K", sentiment: "Positive", status: "Stable" },
  ];

  return (
    <AppShell>
      <ModulePage title="Social Listening Analyst" subtitle="Social listening analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
