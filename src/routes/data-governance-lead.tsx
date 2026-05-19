import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/data-governance-lead")({
  head: () => ({ meta: [{ title: "Data Governance Lead — SaaS Vala" }, { name: "description", content: "Data governance management" }] }),
  component: Page,
});

function Page() {
  const { data: dgLeadData, isLoading, error, refetch } = useQuery({
    queryKey: ["data-governance-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Data Governance Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Data Governance Lead" subtitle="Data governance management" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Data Governance Lead"
          subtitle="Data governance management"
          message="We couldn't load Data Governance Lead data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Data Domains", value: "12", delta: "+2", up: true },
    { label: "Governance Score", value: "92%", delta: "+3%", up: true },
    { label: "Compliance Status", value: "98%", delta: "+1%", up: true },
    { label: "Data Stewards", value: "15", delta: "+3", up: true },
  ];

  const columns = [
    { key: "policy", label: "Policy" },
    { key: "status", label: "Status" },
    { key: "coverage", label: "Coverage" },
    { key: "lastReview", label: "Last Review" },
  ];

  const rows = [
    { policy: "Data Classification", status: "Active", coverage: "95%", lastReview: "2024-06-01" },
    { policy: "Data Retention", status: "Active", coverage: "92%", lastReview: "2024-05-15" },
    { policy: "Data Access", status: "Active", coverage: "98%", lastReview: "2024-06-10" },
    { policy: "Data Quality", status: "Active", coverage: "88%", lastReview: "2024-05-01" },
    { policy: "Privacy Compliance", status: "Active", coverage: "100%", lastReview: "2024-06-15" },
  ];

  return (
    <AppShell>
      <ModulePage title="Data Governance Lead" subtitle="Data governance management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
