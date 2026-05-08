import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/merchant")({
  head: () => ({ meta: [{ title: "Merchant Dashboard — SaaS Vala" }, { name: "description", content: "Merchant portal" }] }),
  component: Page,
});

function Page() {
  const { data: merchantData, isLoading, error } = useQuery({
    queryKey: ["merchant-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Merchant data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Merchant Dashboard" subtitle="Merchant portal" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Merchant data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Store Revenue", value: "$8.5K", delta: "+12%", up: true },
    { label: "Orders", value: "156", delta: "+18", up: true },
    { label: "Products", value: "23", delta: "+3", up: true },
    { label: "Customers", value: "89", delta: "+5", up: true },
  ] : [];

  const columns = [
    { key: "order", label: "Order" },
    { key: "customer", label: "Customer" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { order: "ORD-001234", customer: "John Smith", amount: "$125", status: "Completed" },
    { order: "ORD-001235", customer: "Sarah Johnson", amount: "$89", status: "Processing" },
    { order: "ORD-001236", customer: "Mike Brown", amount: "$156", status: "Completed" },
    { order: "ORD-001237", customer: "Emily Davis", amount: "$78", status: "Pending" },
    { order: "ORD-001238", customer: "Alex Wilson", amount: "$234", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Merchant Dashboard" subtitle="Merchant portal" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
