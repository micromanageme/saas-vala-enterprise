import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/freight-manager")({
  head: () => ({ meta: [{ title: "Freight Manager — SaaS Vala" }, { name: "description", content: "Freight management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: freightData, isLoading, error } = useQuery({
    queryKey: ["freight-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Freight Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Freight Manager" subtitle="Freight management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Freight Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Shipments Managed", value: "350", delta: "+40", up: true },
    { label: "On-Time Rate", value: "92%", delta: "+2%", up: true },
    { label: "Cost per Shipment", value: "$250", delta: "-$15", up: true },
    { label: "Carrier Satisfaction", value: "4.5/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "shipment", label: "Freight Shipment" },
    { key: "mode", label: "Mode" },
    { key: "weight", label: "Weight (tons)" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { shipment: "FRG-001", mode: "Air", weight: "5", status: "In Transit" },
    { shipment: "FRG-002", mode: "Sea", weight: "50", status: "In Port" },
    { shipment: "FRG-003", mode: "Road", weight: "10", status: "Delivered" },
    { shipment: "FRG-004", mode: "Rail", weight: "100", status: "In Transit" },
    { shipment: "FRG-005", mode: "Air", weight: "3", status: "Delivered" },
  ];

  return (
    <AppShell>
      <ModulePage title="Freight Manager" subtitle="Freight management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
