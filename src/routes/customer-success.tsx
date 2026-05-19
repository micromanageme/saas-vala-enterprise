import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/customer-success")({
  head: () => ({ meta: [{ title: "Customer Success — SaaS Vala" }, { name: "description", content: "Customer success workspace" }] }),
  component: Page,
});

function Page() {
  const { data: csData, isLoading, error, refetch } = useQuery({
    queryKey: ["customer-success-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Customer Success data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Customer Success" subtitle="Customer success workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Customer Success"
          subtitle="Customer success workspace"
          message="We couldn't load Customer Success data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Accounts Managed", value: "25", delta: "+3", up: true },
    { label: "Health Score", value: "4.5/5", delta: "+0.2", up: true },
    { label: "NPS Score", value: "72", delta: "+5", up: true },
    { label: "Churn Rate", value: "2.5%", delta: "-0.5%", up: true },
  ];

  const columns = [
    { key: "customer", label: "Customer" },
    { key: "health", label: "Health" },
    { key: "lastContact", label: "Last Contact" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { customer: "Acme Corp", health: "Good", lastContact: "2d ago", status: "On Track" },
    { customer: "TechStart Inc", health: "Excellent", lastContact: "1d ago", status: "On Track" },
    { customer: "Global Ltd", health: "At Risk", lastContact: "5d ago", status: "Needs Attention" },
    { customer: "Innovate Co", health: "Good", lastContact: "3d ago", status: "On Track" },
    { customer: "Future Systems", health: "Excellent", lastContact: "1d ago", status: "On Track" },
  ];

  return (
    <AppShell>
      <ModulePage title="Customer Success" subtitle="Customer success workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
