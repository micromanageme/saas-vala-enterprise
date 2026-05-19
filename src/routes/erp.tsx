import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";

export const Route = createFileRoute("/erp")({
  head: () => ({ meta: [{ title: "Sales / ERP — SaaS Vala" }, { name: "description", content: "Quotations, orders & invoicing" }] }),
  component: Page,
});

function Page() {
  const { data: erpData, isLoading, error, refetch } = useQuery({
    queryKey: ["erp"],
    queryFn: async () => {
      const response = await fetch("/api/erp?type=all");
      if (!response.ok) throw new Error("Failed to fetch ERP data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Sales / ERP" subtitle="Quotations, orders & invoicing" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Sales / ERP"
          subtitle="Quotations, orders & invoicing"
          message="We couldn't load ERP data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = erpData?.data;
  const kpis = data?.kpis ? [
    { label: "Quotations", value: data.kpis.quotations.toString(), delta: `+${data.kpis.quotationsDelta}%`, up: data.kpis.quotationsDelta > 0 },
    { label: "Sales Orders", value: data.kpis.salesOrders.toString(), delta: `+${data.kpis.salesOrdersDelta}%`, up: data.kpis.salesOrdersDelta > 0 },
    { label: "Invoiced", value: `$${(data.kpis.invoiced / 1000).toFixed(0)}K`, delta: `+${data.kpis.invoicedDelta}%`, up: data.kpis.invoicedDelta > 0 },
    { label: "Backorders", value: data.kpis.backorders.toString(), delta: data.kpis.backordersDelta.toString(), up: data.kpis.backordersDelta < 0 }
  ] : [];

  const columns = [{ key: "so", label: "SO #" }, { key: "customer", label: "Customer" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }];
  const rows = data?.orders?.map((order: any) => ({
    so: order.id,
    customer: order.customer,
    amount: `$${order.amount.toLocaleString()}`,
    status: order.status
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Sales / ERP" subtitle="Quotations, orders & invoicing" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
