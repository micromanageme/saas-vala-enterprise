import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/interoperability-fabric-admin")({
  head: () => ({ meta: [{ title: "Interoperability Fabric Admin — SaaS Vala" }, { name: "description", content: "Interoperability fabric administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: interopData, isLoading, error } = useQuery({
    queryKey: ["interoperability-fabric-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Interoperability Fabric Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Interoperability Fabric Admin" subtitle="Interoperability fabric administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Interoperability Fabric Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Protocols Integrated", value: "45", delta: "+5", up: true },
    { label: "Throughput", value: "10GB/s", delta: "+1GB/s", up: true },
    { label: "Success Rate", value: "99%", delta: "+0.5%", up: true },
    { label: "Systems Connected", value: "150", delta: "+15", up: true },
  ];

  const columns = [
    { key: "protocol", label: "Integration Protocol" },
    { key: "source", label: "Source System" },
    { key: "target", label: "Target System" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { protocol: "INT-001", source: "ERP", target: "CRM", status: "Active" },
    { protocol: "INT-002", source: "HRM", target: "Finance", status: "Active" },
    { protocol: "INT-003", source: "Inventory", target: "Sales", status: "Active" },
    { protocol: "INT-004", source: "External", target: "Internal", status: "In Development" },
    { protocol: "INT-005", source: "Analytics", target: "All", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Interoperability Fabric Admin" subtitle="Interoperability fabric administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
