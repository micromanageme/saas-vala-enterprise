import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/audit-manager")({
  head: () => ({ meta: [{ title: "Audit Manager — SaaS Vala" }, { name: "description", content: "Audit management" }] }),
  component: Page,
});

function Page() {
  const { data: auditData, isLoading, error, refetch } = useQuery({
    queryKey: ["audit-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Audit Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Audit Manager" subtitle="Audit management" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Audit Manager"
          subtitle="Audit management"
          message="We couldn't load Audit Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Audits Completed", value: "8", delta: "+2", up: true },
    { label: "Findings", value: "12", delta: "-3", up: true },
    { label: "Compliance Score", value: "96%", delta: "+2%", up: true },
    { label: "Remediation Rate", value: "85%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "audit", label: "Audit" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "completion", label: "Completion" },
  ];

  const rows = [
    { audit: "Q2 Financial Audit", type: "Financial", status: "In Progress", completion: "75%" },
    { audit: "Security Audit", type: "Security", status: "Complete", completion: "100%" },
    { audit: "Compliance Review", type: "Compliance", status: "In Progress", completion: "60%" },
    { audit: "Operational Audit", type: "Operational", status: "Scheduled", completion: "0%" },
    { audit: "IT Audit", type: "IT", status: "Complete", completion: "100%" },
  ];

  return (
    <AppShell>
      <ModulePage title="Audit Manager" subtitle="Audit management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
