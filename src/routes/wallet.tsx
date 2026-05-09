import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "Wallet — SaaS Vala" }, { name: "description", content: "Balance, payouts & commissions" }] }),
  component: Page,
});

function Page() {
  const { data: walletData, isLoading, error } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const response = await fetch("/api/wallet?type=all");
      if (!response.ok) throw new Error("Failed to fetch Wallet data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Wallet" subtitle="Balance, payouts & commissions" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Wallet data</div>
      </AppShell>
    );
  }

  const data = walletData?.data;
  const kpis = data?.kpis ? [
    { label: "Balance", value: `$${data.kpis.balance.toLocaleString()}`, delta: `+${data.kpis.balanceDelta}%`, up: data.kpis.balanceDelta > 0 },
    { label: "Pending", value: `$${data.kpis.pending.toLocaleString()}`, delta: `+${data.kpis.pendingDelta}%`, up: data.kpis.pendingDelta > 0 },
    { label: "Withdrawn", value: `$${data.kpis.withdrawn.toLocaleString()}`, delta: `+${data.kpis.withdrawnDelta}%`, up: data.kpis.withdrawnDelta > 0 },
    { label: "Transactions", value: data.kpis.transactions.toString(), delta: `+${data.kpis.transactionsDelta}%`, up: data.kpis.transactionsDelta > 0 }
  ] : [];

  const columns = [{ key: "description", label: "Description" }, { key: "type", label: "Type" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }];
  const rows = data?.transactions?.map((txn: any) => ({
    description: txn.description,
    type: txn.type,
    amount: txn.type === "CREDIT" ? `+$${txn.amount.toLocaleString()}` : `-$${txn.amount.toLocaleString()}`,
    status: txn.status
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Wallet" subtitle="Balance, payouts & commissions" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
