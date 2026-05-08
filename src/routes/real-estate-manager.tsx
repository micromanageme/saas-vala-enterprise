import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/real-estate-manager")({
  head: () => ({ meta: [{ title: "Real Estate Manager — SaaS Vala" }, { name: "description", content: "Real estate management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: realEstateData, isLoading, error } = useQuery({
    queryKey: ["real-estate-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Real Estate Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Real Estate Manager" subtitle="Real estate management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Real Estate Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Properties Managed", value: "250", delta: "+15", up: true },
    { label: "Occupancy Rate", value: "92%", delta: "+2%", up: true },
    { label: "Rental Income", value: "$2.5M", delta: "+$300K", up: true },
    { label: "Maintenance Requests", value: "45", delta: "-5", up: true },
  ];

  const columns = [
    { key: "property", label: "Property" },
    { key: "type", label: "Type" },
    { key: "tenants", label: "Tenants" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { property: "PROP-001", type: "Commercial", tenants: "25", status: "Occupied" },
    { property: "PROP-002", type: "Residential", tenants: "50", status: "Occupied" },
    { property: "PROP-003", type: "Industrial", tenants: "8", status: "Occupied" },
    { property: "PROP-004", type: "Commercial", tenants: "0", status: "Vacant" },
    { property: "PROP-005", type: "Residential", tenants: "30", status: "Occupied" },
  ];

  return (
    <AppShell>
      <ModulePage title="Real Estate Manager" subtitle="Real estate management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
