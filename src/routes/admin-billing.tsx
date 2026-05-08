import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin-billing")({
  head: () => ({ meta: [{ title: "Billing & Finance — Super Admin" }, { name: "description", content: "Global billing and financial management" }] }),
  component: Page,
});

function Page() {
  const { data: billingData, isLoading, error } = useQuery({
    queryKey: ["admin-billing"],
    queryFn: async () => {
      const response = await fetch("/api/admin/billing?type=all");
      if (!response.ok) throw new Error("Failed to fetch billing data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Billing & Finance" subtitle="Global billing and financial management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load billing data</div>
      </AppShell>
    );
  }

  const data = billingData?.data;
  const kpis = data?.kpis ? [
    { label: "Total Revenue", value: `$${(data.kpis.totalRevenue / 1000000).toFixed(2)}M`, delta: `+${data.kpis.revenueDelta}%`, up: data.kpis.revenueDelta > 0 },
    { label: "Monthly Revenue", value: `$${(data.kpis.monthlyRevenue / 1000).toFixed(0)}K`, delta: `+${data.kpis.revenueDelta}%`, up: data.kpis.revenueDelta > 0 },
    { label: "Total Invoices", value: data.kpis.totalInvoices.toString(), delta: `+${data.kpis.invoicesDelta}`, up: data.kpis.invoicesDelta > 0 },
    { label: "Active Subscriptions", value: data.kpis.activeSubscriptions.toString(), delta: `+${data.kpis.subscriptionsDelta}`, up: data.kpis.subscriptionsDelta > 0 },
  ] : [];

  const columns = [
    { key: "invoiceNumber", label: "Invoice" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "dueDate", label: "Due Date" },
    { key: "user", label: "User" },
    { key: "company", label: "Company" },
  ];

  const rows = data?.invoices?.map((inv: any) => ({
    invoiceNumber: inv.invoiceNumber,
    amount: `$${inv.amount.toLocaleString()}`,
    status: inv.status,
    dueDate: new Date(inv.dueDate).toLocaleDateString(),
    user: inv.user,
    company: inv.company || "—",
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Billing & Finance" subtitle="Global billing and financial management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
