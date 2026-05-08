import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/blood-bank-manager")({
  head: () => ({ meta: [{ title: "Blood Bank Manager — SaaS Vala" }, { name: "description", content: "Blood bank management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: bloodBankData, isLoading, error } = useQuery({
    queryKey: ["blood-bank-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Blood Bank Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Blood Bank Manager" subtitle="Blood bank management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Blood Bank Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Units Collected", value: "450", delta: "+50", up: true },
    { label: "Units Distributed", value: "380", delta: "+30", up: true },
    { label: "Inventory Level", value: "85%", delta: "+5%", up: true },
    { label: "Donor Retention", value: "78%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "bloodType", label: "Blood Type" },
    { key: "units", label: "Available Units" },
    { key: "demand", label: "Weekly Demand" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { bloodType: "A+", units: "85", demand: "60", status: "Adequate" },
    { bloodType: "A-", units: "35", demand: "40", status: "Low" },
    { bloodType: "B+", units: "75", demand: "55", status: "Adequate" },
    { bloodType: "B-", units: "25", demand: "30", status: "Low" },
    { bloodType: "O+", units: "120", demand: "90", status: "Adequate" },
  ];

  return (
    <AppShell>
      <ModulePage title="Blood Bank Manager" subtitle="Blood bank management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
