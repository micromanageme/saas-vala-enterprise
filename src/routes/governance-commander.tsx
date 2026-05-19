import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/governance-commander")({
  head: () => ({ meta: [{ title: "Governance Commander — SaaS Vala" }, { name: "description", content: "Governance command workspace" }] }),
  component: Page,
});

function Page() {
  const { data: governanceData, isLoading, error, refetch } = useQuery({
    queryKey: ["governance-commander-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Governance Commander data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Governance Commander" subtitle="Governance command workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Governance Commander"
          subtitle="Governance command workspace"
          message="We couldn't load Governance Commander data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Policies Enforced", value: "150", delta: "+15", up: true },
    { label: "Governance Score", value: "94", delta: "+2", up: true },
    { label: "Audits Passed", value: "95%", delta: "+2%", up: true },
    { label: "Risk Level", value: "Low", delta: "0", up: true },
  ];

  const columns = [
    { key: "policy", label: "Governance Policy" },
    { key: "domain", label: "Domain" },
    { key: "compliance", label: "Compliance" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { policy: "GOV-001", domain: "Data", compliance: "95%", status: "Active" },
    { policy: "GOV-002", domain: "Security", compliance: "98%", status: "Active" },
    { policy: "GOV-003", domain: "Privacy", compliance: "92%", status: "In Review" },
    { policy: "GOV-004", domain: "Ethics", compliance: "96%", status: "Active" },
    { policy: "GOV-005", domain: "Compliance", compliance: "94%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Governance Commander" subtitle="Governance command workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
