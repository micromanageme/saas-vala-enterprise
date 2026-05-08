import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/import-manager")({
  head: () => ({ meta: [{ title: "Import Manager — SaaS Vala" }, { name: "description", content: "Import management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: importData, isLoading, error } = useQuery({
    queryKey: ["import-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Import Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Import Manager" subtitle="Import management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Import Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Shipments Received", value: "125", delta: "+15", up: true },
    { label: "Value Imported", value: "$5.2M", delta: "+$500K", up: true },
    { label: "Clearance Rate", value: "95%", delta: "+2%", up: true },
    { label: "Customs Compliance", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "shipment", label: "Shipment" },
    { key: "origin", label: "Origin" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { shipment: "IMP-001", origin: "China", value: "$50K", status: "In Transit" },
    { shipment: "IMP-002", origin: "Germany", value: "$80K", status: "Cleared" },
    { shipment: "IMP-003", origin: "USA", value: "$120K", status: "In Transit" },
    { shipment: "IMP-004", origin: "Japan", value: "$60K", status: "In Customs" },
    { shipment: "IMP-005", origin: "India", value: "$40K", status: "Cleared" },
  ];

  return (
    <AppShell>
      <ModulePage title="Import Manager" subtitle="Import management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
