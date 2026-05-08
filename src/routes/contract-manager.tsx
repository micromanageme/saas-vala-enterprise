import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/contract-manager")({
  head: () => ({ meta: [{ title: "Contract Manager — SaaS Vala" }, { name: "description", content: "Contract management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: contractData, isLoading, error } = useQuery({
    queryKey: ["contract-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Contract Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Contract Manager" subtitle="Contract management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Contract Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Contracts", value: "125", delta: "+8", up: true },
    { label: "Pending Approval", value: "15", delta: "-3", up: true },
    { label: "Expiring Soon", value: "8", delta: "+2", up: false },
    { label: "Contract Value", value: "$2.5M", delta: "+$300K", up: true },
  ];

  const columns = [
    { key: "contract", label: "Contract" },
    { key: "party", label: "Counterparty" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { contract: "Service Agreement 2024", party: "Acme Corp", value: "$500K", status: "Active" },
    { contract: "Software License", party: "Tech Solutions", value: "$250K", status: "Active" },
    { contract: "Consulting Contract", party: "Global Retail", value: "$180K", status: "Pending" },
    { contract: "NDA Agreement", party: "StartUp Inc", value: "$0", status: "Active" },
    { contract: "Maintenance Contract", party: "Enterprise LLC", value: "$120K", status: "Expiring" },
  ];

  return (
    <AppShell>
      <ModulePage title="Contract Manager" subtitle="Contract management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
