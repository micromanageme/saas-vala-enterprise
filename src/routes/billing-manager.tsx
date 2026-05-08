import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/billing-manager")({
  head: () => ({ meta: [{ title: "Billing Manager — SaaS Vala" }, { name: "description", content: "Billing management" }] }),
  component: Page,
});

function Page() {
  const { data: billingData, isLoading, error } = useQuery({
    queryKey: ["billing-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Billing Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Billing Manager" subtitle="Billing management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Billing Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Invoices Generated", value: "234", delta: "+18", up: true },
    { label: "Outstanding Balance", value: "$45K", delta: "-$5K", up: true },
    { label: "Collection Rate", value: "94%", delta: "+2%", up: true },
    { label: "Disputes", value: "5", delta: "-2", up: true },
  ];

  const columns = [
    { key: "invoice", label: "Invoice" },
    { key: "customer", label: "Customer" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { invoice: "INV-001234", customer: "Acme Corp", amount: "$12,500", status: "Paid" },
    { invoice: "INV-001235", customer: "TechStart", amount: "$8,200", status: "Overdue" },
    { invoice: "INV-001236", customer: "Global Ltd", amount: "$15,000", status: "Pending" },
    { invoice: "INV-001237", customer: "Innovate Co", amount: "$6,800", status: "Sent" },
    { invoice: "INV-001238", customer: "Future Systems", amount: "$22,000", status: "Processing" },
  ];

  return (
    <AppShell>
      <ModulePage title="Billing Manager" subtitle="Billing management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
