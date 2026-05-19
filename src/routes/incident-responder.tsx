import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/incident-responder")({
  head: () => ({ meta: [{ title: "Incident Responder — SaaS Vala" }, { name: "description", content: "Incident response workspace" }] }),
  component: Page,
});

function Page() {
  const { data: incidentData, isLoading, error, refetch } = useQuery({
    queryKey: ["incident-responder-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Incident Responder data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Incident Responder" subtitle="Incident response workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Incident Responder"
          subtitle="Incident response workspace"
          message="We couldn't load Incident Responder data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Incidents", value: "3", delta: "-1", up: true },
    { label: "MTTR", value: "45min", delta: "-15min", up: true },
    { label: "MTTD", value: "5min", delta: "-2min", up: true },
    { label: "Response Rate", value: "98%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "incident", label: "Incident" },
    { key: "severity", label: "Severity" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { incident: "INC-001234", severity: "Critical", duration: "45min", status: "In Progress" },
    { incident: "INC-001235", severity: "High", duration: "20min", status: "Monitoring" },
    { incident: "INC-001236", severity: "Medium", duration: "10min", status: "Resolved" },
    { incident: "INC-001237", severity: "Low", duration: "5min", status: "Resolved" },
    { incident: "INC-001238", severity: "High", duration: "30min", status: "Resolved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Incident Responder" subtitle="Incident response workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
