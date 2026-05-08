import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/beneficiary-manager")({
  head: () => ({ meta: [{ title: "Beneficiary Manager — SaaS Vala" }, { name: "description", content: "Beneficiary management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: beneficiaryData, isLoading, error } = useQuery({
    queryKey: ["beneficiary-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Beneficiary Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Beneficiary Manager" subtitle="Beneficiary management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Beneficiary Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Beneficiaries Registered", value: "5.2K", delta: "+300", up: true },
    { label: "Services Provided", value: "12.5K", delta: "+1K", up: true },
    { label: "Success Rate", value: "88%", delta: "+3%", up: true },
    { label: "Satisfaction", value: "4.7/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "beneficiary", label: "Beneficiary" },
    { key: "program", label: "Program" },
    { key: "assistance", label: "Assistance Type" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { beneficiary: "BEN-001", program: "Education", assistance: "Scholarship", status: "Active" },
    { beneficiary: "BEN-002", program: "Healthcare", assistance: "Medical", status: "Active" },
    { beneficiary: "BEN-003", program: "Housing", assistance: "Shelter", status: "Active" },
    { beneficiary: "BEN-004", program: "Food Security", assistance: "Rations", status: "Active" },
    { beneficiary: "BEN-005", program: "Education", assistance: "Scholarship", status: "Graduated" },
  ];

  return (
    <AppShell>
      <ModulePage title="Beneficiary Manager" subtitle="Beneficiary management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
