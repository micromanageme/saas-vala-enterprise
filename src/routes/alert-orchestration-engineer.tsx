import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/alert-orchestration-engineer")({
  head: () => ({ meta: [{ title: "Alert Orchestration Engineer — SaaS Vala" }, { name: "description", content: "Alert orchestration engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: alertData, isLoading, error } = useQuery({
    queryKey: ["alert-orchestration-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Alert Orchestration Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Alert Orchestration Engineer" subtitle="Alert orchestration engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Alert Orchestration Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Alerts Processed", value: "5K", delta: "+500", up: true },
    { label: "Response Time", value: "30sec", delta: "-5sec", up: true },
    { label: "Escalations", value: "5%", delta: "-1%", up: true },
    { label: "Automation Rate", value: "85%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "alert", label: "Alert Rule" },
    { key: "source", label: "Source" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { alert: "ALT-001", source: "System", severity: "High", status: "Active" },
    { alert: "ALT-002", source: "Application", severity: "Medium", status: "Active" },
    { alert: "ALT-003", source: "Security", severity: "Critical", status: "Active" },
    { alert: "ALT-004", source: "Infrastructure", severity: "Low", status: "Paused" },
    { alert: "ALT-005", source: "System", severity: "Medium", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Alert Orchestration Engineer" subtitle="Alert orchestration engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
