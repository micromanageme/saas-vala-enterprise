import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/customer-success-manager")({
  head: () => ({ meta: [{ title: "Customer Success Manager — SaaS Vala" }, { name: "description", content: "Customer success workspace" }] }),
  component: Page,
});

function Page() {
  const { data: csData, isLoading, error, refetch } = useQuery({
    queryKey: ["customer-success-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Customer Success Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Customer Success Manager" subtitle="Customer success workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Customer Success Manager"
          subtitle="Customer success workspace"
          message="We couldn't load Customer Success Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Accounts Managed", value: "45", delta: "+5", up: true },
    { label: "Health Score", value: "4.5/5", delta: "+0.2", up: true },
    { label: "Retention Rate", value: "94%", delta: "+2%", up: true },
    { label: "Expansion Revenue", value: "$45K", delta: "+$8K", up: true },
  ];

  const columns = [
    { key: "account", label: "Account" },
    { key: "health", label: "Health" },
    { key: "nrr", label: "NRR" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { account: "Acme Corp", health: "4.8/5", nrr: "120%", status: "Healthy" },
    { account: "Tech Solutions", health: "4.5/5", nrr: "110%", status: "Healthy" },
    { account: "Global Retail", health: "4.2/5", nrr: "95%", status: "Healthy" },
    { account: "StartUp Inc", health: "3.8/5", nrr: "85%", status: "At Risk" },
    { account: "Enterprise LLC", health: "4.0/5", nrr: "100%", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Customer Success Manager" subtitle="Customer success workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
