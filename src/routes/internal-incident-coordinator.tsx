import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/internal-incident-coordinator")({
  head: () => ({ meta: [{ title: "Internal Incident Coordinator — SaaS Vala" }, { name: "description", content: "Internal incident coordination workspace" }] }),
  component: Page,
});

function Page() {
  const { data: incidentData, isLoading, error } = useQuery({
    queryKey: ["internal-incident-coordinator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Internal Incident Coordinator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Internal Incident Coordinator" subtitle="Internal incident coordination workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Internal Incident Coordinator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Incidents Active", value: "12", delta: "+2", up: true },
    { label: "MTTR", value: "30min", delta: "-5min", up: true },
    { label: "Resolution Rate", value: "88%", delta: "+3%", up: true },
    { label: "Escalations", value: "3", delta: "-1", up: true },
  ];

  const columns = [
    { key: "incident", label: "Incident" },
    { key: "severity", label: "Severity" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { incident: "INC-001", severity: "Critical", duration: "45min", status: "Active" },
    { incident: "INC-002", severity: "High", duration: "30min", status: "Active" },
    { incident: "INC-003", severity: "Medium", duration: "15min", status: "Resolved" },
    { incident: "INC-004", severity: "Low", duration: "10min", status: "Resolved" },
    { incident: "INC-005", severity: "High", duration: "20min", status: "In Review" },
  ];

  return (
    <AppShell>
      <ModulePage title="Internal Incident Coordinator" subtitle="Internal incident coordination workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
