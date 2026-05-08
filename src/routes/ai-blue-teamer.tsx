import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ai-blue-teamer")({
  head: () => ({ meta: [{ title: "AI Blue Teamer — SaaS Vala" }, { name: "description", content: "AI blue teaming workspace" }] }),
  component: Page,
});

function Page() {
  const { data: blueTeamData, isLoading, error } = useQuery({
    queryKey: ["ai-blue-teamer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch AI Blue Teamer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="AI Blue Teamer" subtitle="AI blue teaming workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load AI Blue Teamer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Defenses Validated", value: "23", delta: "+5", up: true },
    { label: "Defense Success Rate", value: "95%", delta: "+3%", up: true },
    { label: "False Positives", value: "2%", delta: "-1%", up: true },
    { label: "Response Time", value: "5min", delta: "-2min", up: true },
  ];

  const columns = [
    { key: "defense", label: "Defense Mechanism" },
    { key: "type", label: "Type" },
    { key: "effectiveness", label: "Effectiveness" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { defense: "Input Sanitization", type: "Prevention", effectiveness: "98%", status: "Active" },
    { defense: "Output Filtering", type: "Prevention", effectiveness: "95%", status: "Active" },
    { defense: "Rate Limiting", type: "Detection", effectiveness: "92%", status: "Active" },
    { defense: "Anomaly Detection", type: "Detection", effectiveness: "90%", status: "Active" },
    { defense: "Human Review", type: "Recovery", effectiveness: "100%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="AI Blue Teamer" subtitle="AI blue teaming workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
