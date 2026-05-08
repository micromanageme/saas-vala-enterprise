import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ai-safety-officer")({
  head: () => ({ meta: [{ title: "AI Safety Officer — SaaS Vala" }, { name: "description", content: "AI safety and compliance" }] }),
  component: Page,
});

function Page() {
  const { data: safetyData, isLoading, error } = useQuery({
    queryKey: ["ai-safety-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch AI Safety Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="AI Safety Officer" subtitle="AI safety and compliance" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load AI Safety Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Safety Incidents", value: "0", delta: "—", up: true },
    { label: "Policy Violations", value: "1", delta: "-1", up: true },
    { label: "Compliance Score", value: "98%", delta: "+1%", up: true },
    { label: "Models Monitored", value: "12", delta: "+2", up: true },
  ];

  const columns = [
    { key: "check", label: "Safety Check" },
    { key: "frequency", label: "Frequency" },
    { key: "lastRun", label: "Last Run" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { check: "Content Moderation", frequency: "Real-time", lastRun: "1m ago", status: "Active" },
    { check: "Harmful Content Filter", frequency: "Real-time", lastRun: "1m ago", status: "Active" },
    { check: "Privacy Compliance", frequency: "Daily", lastRun: "2h ago", status: "Passed" },
    { check: "Fairness Audit", frequency: "Weekly", lastRun: "1d ago", status: "Passed" },
    { check: "Security Review", frequency: "Monthly", lastRun: "5d ago", status: "Passed" },
  ];

  return (
    <AppShell>
      <ModulePage title="AI Safety Officer" subtitle="AI safety and compliance" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
