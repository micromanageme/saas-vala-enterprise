import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/account-manager")({
  head: () => ({ meta: [{ title: "Account Manager — SaaS Vala" }, { name: "description", content: "Account management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: accountMgrData, isLoading, error, refetch } = useQuery({
    queryKey: ["account-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Account Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Account Manager" subtitle="Account management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Account Manager"
          subtitle="Account management workspace"
          message="We couldn't load Account Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Accounts Managed", value: "15", delta: "+2", up: true },
    { label: "Account Revenue", value: "$125K", delta: "+18%", up: true },
    { label: "Renewal Rate", value: "92%", delta: "+3%", up: true },
    { label: "Upsells", value: "5", delta: "+2", up: true },
  ];

  const columns = [
    { key: "account", label: "Account" },
    { key: "revenue", label: "Revenue" },
    { key: "renewal", label: "Renewal" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { account: "Acme Corp", revenue: "$45K", renewal: "2025-03-15", status: "Active" },
    { account: "TechStart Inc", revenue: "$25K", renewal: "2025-06-15", status: "Active" },
    { account: "Global Ltd", revenue: "$30K", renewal: "2025-01-15", status: "At Risk" },
    { account: "Innovate Co", revenue: "$15K", renewal: "2025-09-15", status: "Active" },
    { account: "Future Systems", revenue: "$10K", renewal: "2025-04-15", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Account Manager" subtitle="Account management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
