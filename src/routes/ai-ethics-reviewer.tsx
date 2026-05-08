import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ai-ethics-reviewer")({
  head: () => ({ meta: [{ title: "AI Ethics Reviewer — SaaS Vala" }, { name: "description", content: "AI ethics review workspace" }] }),
  component: Page,
});

function Page() {
  const { data: aiEthicsData, isLoading, error } = useQuery({
    queryKey: ["ai-ethics-reviewer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch AI Ethics Reviewer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="AI Ethics Reviewer" subtitle="AI ethics review workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load AI Ethics Reviewer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Models Reviewed", value: "35", delta: "+5", up: true },
    { label: "Bias Score", value: "95", delta: "+2", up: true },
    { label: "Fairness", value: "92%", delta: "+3%", up: true },
    { label: "Transparency", value: "90%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "model", label: "AI Model" },
    { key: "type", label: "Type" },
    { key: "ethics", label: "Ethics Score" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { model: "AI-001", type: "Classification", ethics: "95", status: "Approved" },
    { model: "AI-002", type: "Generation", ethics: "92", status: "In Review" },
    { model: "AI-003", type: "Recommendation", ethics: "98", status: "Approved" },
    { model: "AI-004", type: "Classification", ethics: "88", status: "Requires Changes" },
    { model: "AI-005", type: "Generation", ethics: "94", status: "Approved" },
  ];

  return (
    <AppShell>
      <ModulePage title="AI Ethics Reviewer" subtitle="AI ethics review workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
