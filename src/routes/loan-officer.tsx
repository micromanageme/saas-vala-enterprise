import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/loan-officer")({
  head: () => ({ meta: [{ title: "Loan Officer — SaaS Vala" }, { name: "description", content: "Loan officer workspace" }] }),
  component: Page,
});

function Page() {
  const { data: loanData, isLoading, error, refetch } = useQuery({
    queryKey: ["loan-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Loan Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Loan Officer" subtitle="Loan officer workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Loan Officer"
          subtitle="Loan officer workspace"
          message="We couldn't load Loan Officer data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Loans Approved", value: "125", delta: "+15", up: true },
    { label: "Disbursement", value: "$5.8M", delta: "+$500K", up: true },
    { label: "Approval Rate", value: "78%", delta: "+3%", up: true },
    { label: "Repayment Rate", value: "94%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "application", label: "Loan Application" },
    { key: "type", label: "Loan Type" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { application: "LN-001", type: "Personal", amount: "$50,000", status: "Approved" },
    { application: "LN-002", type: "Mortgage", amount: "$250,000", status: "In Review" },
    { application: "LN-003", type: "Auto", amount: "$30,000", status: "Approved" },
    { application: "LN-004", type: "Business", amount: "$500,000", status: "Pending" },
    { application: "LN-005", type: "Education", amount: "$25,000", status: "Approved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Loan Officer" subtitle="Loan officer workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
