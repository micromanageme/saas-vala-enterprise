import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/threat-response-commander")({
  head: () => ({ meta: [{ title: "Threat Response Commander — SaaS Vala" }, { name: "description", content: "Threat response command" }] }),
  component: Page,
});

function Page() {
  const { data: threatData, isLoading, error, refetch } = useQuery({
    queryKey: ["threat-response-commander-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Threat Response Commander data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Threat Response Commander" subtitle="Threat response command" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Threat Response Commander"
          subtitle="Threat response command"
          message="We couldn't load Threat Response Commander data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Threats", value: "2", delta: "-1", up: true },
    { label: "MTTR", value: "45min", delta: "-15min", up: true },
    { label: "Threats Blocked", value: "1,234", delta: "+156", up: true },
    { label: "Response Readiness", value: "98%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "threat", label: "Threat" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
    { key: "response", label: "Response" },
  ];

  const rows = [
    { threat: "SQL Injection Attempt", severity: "High", status: "Blocked", response: "Auto" },
    { threat: "Brute Force Attack", severity: "Medium", status: "Monitoring", response: "Auto" },
    { threat: "Phishing Campaign", severity: "High", status: "Investigating", response: "Manual" },
    { threat: "DDoS Attack", severity: "Critical", status: "Mitigated", response: "Auto" },
    { threat: "Malware Detection", severity: "High", status: "Blocked", response: "Auto" },
  ];

  return (
    <AppShell>
      <ModulePage title="Threat Response Commander" subtitle="Threat response command" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
