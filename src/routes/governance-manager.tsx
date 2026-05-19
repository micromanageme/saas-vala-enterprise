import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/governance-manager")({
  head: () => ({ meta: [{ title: "Governance Manager — SaaS Vala" }, { name: "description", content: "Governance management" }] }),
  component: Page,
});

function Page() {
  const { data: govData, isLoading, error, refetch } = useQuery({
    queryKey: ["governance-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Governance Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Governance Manager" subtitle="Governance management" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Governance Manager"
          subtitle="Governance management"
          message="We couldn't load Governance Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Policies Active", value: "23", delta: "+1", up: true },
    { label: "Compliance Score", value: "96%", delta: "+2%", up: true },
    { label: "Risk Assessments", value: "12", delta: "+2", up: true },
    { label: "Governance Reviews", value: "8", delta: "+1", up: true },
  ];

  const columns = [
    { key: "framework", label: "Framework" },
    { key: "status", label: "Status" },
    { key: "lastReview", label: "Last Review" },
    { key: "nextReview", label: "Next Review" },
  ];

  const rows = [
    { framework: "IT Governance", status: "Compliant", lastReview: "2024-06-01", nextReview: "2024-12-01" },
    { framework: "Data Governance", status: "Compliant", lastReview: "2024-05-15", nextReview: "2024-11-15" },
    { framework: "Security Governance", status: "Compliant", lastReview: "2024-06-15", nextReview: "2024-12-15" },
    { framework: "Risk Governance", status: "Compliant", lastReview: "2024-04-01", nextReview: "2024-10-01" },
    { framework: "Compliance Governance", status: "Compliant", lastReview: "2024-05-01", nextReview: "2024-11-01" },
  ];

  return (
    <AppShell>
      <ModulePage title="Governance Manager" subtitle="Governance management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
