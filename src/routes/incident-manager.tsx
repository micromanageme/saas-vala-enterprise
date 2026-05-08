import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/incident-manager")({
  head: () => ({ meta: [{ title: "Incident Manager — SaaS Vala" }, { name: "description", content: "Incident management" }] }),
  component: Page,
});

function Page() {
  const { data: incidentData, isLoading, error } = useQuery({
    queryKey: ["incident-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Incident Manager data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Incident Manager" subtitle="Incident management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Incident Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Incidents", value: "3", delta: "-1", up: true },
    { label: "MTTR", value: "2.5h", delta: "-0.5h", up: true },
    { label: "MTTD", value: "15min", delta: "-5min", up: true },
    { label: "Escalations", value: "1", delta: "-1", up: true },
  ];

  const columns = [
    { key: "incident", label: "Incident" },
    { key: "severity", label: "Severity" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { incident: "INC-001234", severity: "High", duration: "2h", status: "In Progress" },
    { incident: "INC-001235", severity: "Medium", duration: "45min", status: "Monitoring" },
    { incident: "INC-001236", severity: "Low", duration: "15min", status: "Resolved" },
    { incident: "INC-001237", severity: "Critical", duration: "1h", status: "Escalated" },
    { incident: "INC-001238", severity: "Medium", duration: "30min", status: "Resolved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Incident Manager" subtitle="Incident management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
