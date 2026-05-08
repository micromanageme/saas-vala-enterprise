import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/accountant")({
  head: () => ({ meta: [{ title: "Accountant — SaaS Vala" }, { name: "description", content: "Accounting management" }] }),
  component: Page,
});

function Page() {
  const { data: accountantData, isLoading, error } = useQuery({
    queryKey: ["accountant-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Accountant data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Accountant" subtitle="Accounting management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Accountant data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Transactions Today", value: "45", delta: "+8", up: true },
    { label: "Pending Reconciliation", value: "12", delta: "-3", up: true },
    { label: "Accuracy Rate", value: "99.8%", delta: "+0.1%", up: true },
    { label: "Reports Generated", value: "8", delta: "+2", up: true },
  ];

  const columns = [
    { key: "transaction", label: "Transaction" },
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { transaction: "TXN-001234", type: "Expense", amount: "$2,500", status: "Reconciled" },
    { transaction: "TXN-001235", type: "Revenue", amount: "$8,200", status: "Reconciled" },
    { transaction: "TXN-001236", type: "Expense", amount: "$1,800", status: "Pending" },
    { transaction: "TXN-001237", type: "Revenue", amount: "$12,500", status: "Reconciled" },
    { transaction: "TXN-001238", type: "Expense", amount: "$3,200", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="Accountant" subtitle="Accounting management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
