import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/reputation-manager")({
  head: () => ({ meta: [{ title: "Reputation Manager — SaaS Vala" }, { name: "description", content: "Reputation management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: reputationData, isLoading, error } = useQuery({
    queryKey: ["reputation-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Reputation Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Reputation Manager" subtitle="Reputation management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Reputation Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Brand Score", value: "85", delta: "+3", up: true },
    { label: "Mentions", value: "5K", delta: "+500", up: true },
    { label: "Sentiment", value: "78%", delta: "+5%", up: true },
    { label: "Crisis Averted", value: "3", delta: "+1", up: true },
  ];

  const columns = [
    { key: "source", label: "Mention Source" },
    { key: "type", label: "Type" },
    { key: "sentiment", label: "Sentiment" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { source: "Social Media", type: "Review", sentiment: "Positive", status: "Monitored" },
    { source: "News", type: "Article", sentiment: "Neutral", status: "Monitored" },
    { source: "Forums", type: "Discussion", sentiment: "Negative", status: "In Review" },
    { source: "Blogs", type: "Post", sentiment: "Positive", status: "Monitored" },
    { source: "Reviews", type: "Rating", sentiment: "Positive", status: "Monitored" },
  ];

  return (
    <AppShell>
      <ModulePage title="Reputation Manager" subtitle="Reputation management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
