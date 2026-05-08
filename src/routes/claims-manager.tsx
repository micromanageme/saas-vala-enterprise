import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/claims-manager")({
  head: () => ({ meta: [{ title: "Claims Manager — SaaS Vala" }, { name: "description", content: "Claims management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: claimsData, isLoading, error } = useQuery({
    queryKey: ["claims-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Claims Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Claims Manager" subtitle="Claims management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Claims Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Claims Received", value: "250", delta: "+25", up: true },
    { label: "Claims Settled", value: "180", delta: "+20", up: true },
    { label: "Settlement Time", value: "7 days", delta: "-1 day", up: true },
    { label: "Customer Satisfaction", value: "4.5/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "claim", label: "Insurance Claim" },
    { key: "type", label: "Type" },
    { key: "amount", label: "Claim Amount" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { claim: "CLM-001", type: "Auto", amount: "$15,000", status: "In Process" },
    { claim: "CLM-002", type: "Health", amount: "$5,000", status: "Approved" },
    { claim: "CLM-003", type: "Property", amount: "$25,000", status: "Under Review" },
    { claim: "CLM-004", type: "Life", amount: "$100,000", status: "Approved" },
    { claim: "CLM-005", type: "Auto", amount: "$8,000", status: "Settled" },
  ];

  return (
    <AppShell>
      <ModulePage title="Claims Manager" subtitle="Claims management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
