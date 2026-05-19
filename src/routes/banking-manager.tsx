import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/banking-manager")({
  head: () => ({ meta: [{ title: "Banking Manager — SaaS Vala" }, { name: "description", content: "Banking management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: bankingData, isLoading, error, refetch } = useQuery({
    queryKey: ["banking-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Banking Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Banking Manager" subtitle="Banking management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Banking Manager"
          subtitle="Banking management workspace"
          message="We couldn't load Banking Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Accounts Managed", value: "25K", delta: "+2K", up: true },
    { label: "Total Deposits", value: "$125M", delta: "+$15M", up: true },
    { label: "Loan Portfolio", value: "$85M", delta: "+$8M", up: true },
    { label: "NPA Ratio", value: "2.5%", delta: "-0.3%", up: true },
  ];

  const columns = [
    { key: "product", label: "Banking Product" },
    { key: "accounts", label: "Accounts" },
    { key: "volume", label: "Volume" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { product: "Savings Account", accounts: "15K", volume: "$50M", status: "Active" },
    { product: "Current Account", accounts: "8K", volume: "$30M", status: "Active" },
    { product: "Fixed Deposit", accounts: "2K", volume: "$45M", status: "Active" },
    { product: "Personal Loan", accounts: "1.5K", volume: "$25M", status: "Active" },
    { product: "Business Loan", accounts: "500", volume: "$60M", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Banking Manager" subtitle="Banking management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
