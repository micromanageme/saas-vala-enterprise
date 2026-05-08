import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/tenant-owner")({
  head: () => ({ meta: [{ title: "Tenant Owner — SaaS Vala" }, { name: "description", content: "Tenant ownership workspace" }] }),
  component: Page,
});

function Page() {
  const { data: tenantOwnerData, isLoading, error } = useQuery({
    queryKey: ["tenant-owner-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Tenant Owner data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Tenant Owner" subtitle="Tenant ownership workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Tenant Owner data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tenant Users", value: "125", delta: "+15", up: true },
    { label: "Active Subscriptions", value: "8", delta: "+1", up: true },
    { label: "Monthly Spend", value: "$12.5K", delta: "+$1.5K", up: true },
    { label: "Tenant Health", value: "98%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "service", label: "Tenant Service" },
    { key: "usage", label: "Usage" },
    { key: "cost", label: "Cost" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { service: "Core Platform", usage: "100%", cost: "$5K", status: "Active" },
    { service: "Analytics Module", usage: "85%", cost: "$2.5K", status: "Active" },
    { service: "Security Suite", usage: "100%", cost: "$3K", status: "Active" },
    { service: "Storage", usage: "60%", cost: "$1K", status: "Active" },
    { service: "Support", usage: "100%", cost: "$1K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Tenant Owner" subtitle="Tenant ownership workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
