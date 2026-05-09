import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/finance-manager")({
  head: () => ({ meta: [{ title: "Finance Manager — SaaS Vala" }, { name: "description", content: "Finance team management" }] }),
  component: Page,
});

function Page() {
  const { data: finData, isLoading, error } = useQuery({
    queryKey: ["finance-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Finance Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Finance Manager" subtitle="Finance team management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Finance Manager data</div>
      </AppShell>
    );
  }

  const data = finData?.data;
  const kpis = data?.kpis ? [
    { label: "Monthly Revenue", value: `$${(data.kpis.monthlyRevenue / 1000).toFixed(0)}K`, delta: `+${data.kpis.revenueDelta}%`, up: data.kpis.revenueDelta > 0 },
    { label: "Expenses", value: `$${(data.kpis.expenses / 1000).toFixed(0)}K`, delta: "-3%", up: true },
    { label: "Invoices Pending", value: "34", delta: "-8", up: true },
    { label: "Budget Variance", value: "-2.3%", delta: "+0.5%", up: true },
  ];

  const columns = [
    { key: "invoice", label: "Invoice" },
    { key: "client", label: "Client" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { invoice: "INV-001234", client: "Acme Corp", amount: "$12,500", status: "Pending" },
    { invoice: "INV-001235", client: "TechStart Inc", amount: "$8,200", status: "Overdue" },
    { invoice: "INV-001236", client: "Global Ltd", amount: "$15,000", status: "Paid" },
    { invoice: "INV-001237", client: "Innovate Co", amount: "$6,800", status: "Pending" },
    { invoice: "INV-001238", client: "Future Systems", amount: "$22,000", status: "Processing" },
  ];

  return (
    <AppShell>
      <ModulePage title="Finance Manager" subtitle="Finance team management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
