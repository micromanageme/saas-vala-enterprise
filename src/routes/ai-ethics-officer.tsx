import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ai-ethics-officer")({
  head: () => ({ meta: [{ title: "AI Ethics Officer — SaaS Vala" }, { name: "description", content: "AI ethics oversight" }] }),
  component: Page,
});

function Page() {
  const { data: ethicsData, isLoading, error } = useQuery({
    queryKey: ["ai-ethics-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch AI Ethics Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="AI Ethics Officer" subtitle="AI ethics oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load AI Ethics Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Models Reviewed", value: "12", delta: "+2", up: true },
    { label: "Ethics Compliance", value: "98%", delta: "+1%", up: true },
    { label: "Bias Flags", value: "2", delta: "-1", up: true },
    { label: "Transparency Score", value: "95%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "model", label: "AI Model" },
    { key: "ethicsScore", label: "Ethics Score" },
    { key: "biasRisk", label: "Bias Risk" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { model: "Customer Support Bot", ethicsScore: "98%", biasRisk: "Low", status: "Approved" },
    { model: "Recommendation Engine", ethicsScore: "92%", biasRisk: "Medium", status: "Review" },
    { model: "Content Moderator", ethicsScore: "95%", biasRisk: "Low", status: "Approved" },
    { model: "Hiring Assistant", ethicsScore: "88%", biasRisk: "High", status: "Needs Review" },
    { model: "Fraud Detection", ethicsScore: "96%", biasRisk: "Low", status: "Approved" },
  ];

  return (
    <AppShell>
      <ModulePage title="AI Ethics Officer" subtitle="AI ethics oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
