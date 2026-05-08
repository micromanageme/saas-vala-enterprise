import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/procurement-manager")({
  head: () => ({ meta: [{ title: "Procurement Manager — SaaS Vala" }, { name: "description", content: "Procurement management" }] }),
  component: Page,
});

function Page() {
  const { data: procurementData, isLoading, error } = useQuery({
    queryKey: ["procurement-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Procurement Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Procurement Manager" subtitle="Procurement management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Procurement Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Pending Orders", value: "12", delta: "-3", up: true },
    { label: "Monthly Spend", value: "$45K", delta: "+5%", up: false },
    { label: "Suppliers", value: "23", delta: "+2", up: true },
    { label: "Cost Savings", value: "8.5%", delta: "+1.5%", up: true },
  ];

  const columns = [
    { key: "order", label: "Order" },
    { key: "supplier", label: "Supplier" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { order: "PO-001234", supplier: "TechCorp", amount: "$8,500", status: "Pending" },
    { order: "PO-001235", supplier: "OfficeSupplies", amount: "$2,300", status: "Approved" },
    { order: "PO-001236", supplier: "CloudServices", amount: "$12,000", status: "Processing" },
    { order: "PO-001237", supplier: "HardwareVendor", amount: "$5,600", status: "Pending" },
    { order: "PO-001238", supplier: "SoftwareLic", amount: "$3,200", status: "Delivered" },
  ];

  return (
    <AppShell>
      <ModulePage title="Procurement Manager" subtitle="Procurement management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
