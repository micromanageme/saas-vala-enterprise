import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ai-incident-responder")({
  head: () => ({ meta: [{ title: "AI Incident Responder — SaaS Vala" }, { name: "description", content: "AI incident response workspace" }] }),
  component: Page,
});

function Page() {
  const { data: incidentData, isLoading, error } = useQuery({
    queryKey: ["ai-incident-responder-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch AI Incident Responder data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="AI Incident Responder" subtitle="AI incident response workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load AI Incident Responder data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Incidents Detected", value: "12", delta: "+2", up: true },
    { label: "Response Time", value: "5min", delta: "-2min", up: true },
    { label: "Resolution Rate", value: "92%", delta: "+3%", up: true },
    { label: "False Positives", value: "8%", delta: "-2%", up: true },
  ];

  const columns = [
    { key: "incident", label: "AI Incident" },
    { key: "type", label: "Type" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { incident: "INC-001", type: "Bias", severity: "High", status: "Resolved" },
    { incident: "INC-002", type: "Drift", severity: "Medium", status: "In Progress" },
    { incident: "INC-003", type: "Adversarial", severity: "Critical", status: "In Progress" },
    { incident: "INC-004", type: "Performance", severity: "Low", status: "Resolved" },
    { incident: "INC-005", type: "Explainability", severity: "Medium", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="AI Incident Responder" subtitle="AI incident response workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
