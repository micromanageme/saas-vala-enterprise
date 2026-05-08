import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/pharmacy-manager")({
  head: () => ({ meta: [{ title: "Pharmacy Manager — SaaS Vala" }, { name: "description", content: "Pharmacy management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: pharmacyData, isLoading, error } = useQuery({
    queryKey: ["pharmacy-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Pharmacy Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Pharmacy Manager" subtitle="Pharmacy management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Pharmacy Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Prescriptions Filled", value: "1.2K", delta: "+150", up: true },
    { label: "Inventory Accuracy", value: "99.5%", delta: "+0.2%", up: true },
    { label: "Dispensing Time", value: "8min", delta: "-1min", up: true },
    { label: "Drug Shortages", value: "2", delta: "-1", up: true },
  ];

  const columns = [
    { key: "medication", label: "Medication" },
    { key: "stock", label: "Stock Level" },
    { key: "demand", label: "Daily Demand" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { medication: "Antibiotics", stock: "850", demand: "120", status: "Adequate" },
    { medication: "Pain Management", stock: "620", demand: "95", status: "Adequate" },
    { medication: "Cardiovascular", stock: "450", demand: "80", status: "Adequate" },
    { medication: "Diabetes Management", stock: "380", demand: "65", status: "Low" },
    { medication: "Respiratory", stock: "520", demand: "110", status: "Adequate" },
  ];

  return (
    <AppShell>
      <ModulePage title="Pharmacy Manager" subtitle="Pharmacy management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
