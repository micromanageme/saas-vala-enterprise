import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/facility-manager")({
  head: () => ({ meta: [{ title: "Facility Manager — SaaS Vala" }, { name: "description", content: "Facility management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: facilityData, isLoading, error } = useQuery({
    queryKey: ["facility-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Facility Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Facility Manager" subtitle="Facility management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Facility Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Facilities Managed", value: "15", delta: "+2", up: true },
    { label: "Energy Efficiency", value: "88%", delta: "+3%", up: true },
    { label: "Maintenance Score", value: "94%", delta: "+2%", up: true },
    { label: "Occupancy", value: "85%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "facility", label: "Facility" },
    { key: "type", label: "Type" },
    { key: "capacity", label: "Capacity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { facility: "FAC-001", type: "Office", capacity: "500", status: "Active" },
    { facility: "FAC-002", type: "Warehouse", capacity: "10,000", status: "Active" },
    { facility: "FAC-003", type: "Data Center", capacity: "5,000", status: "Active" },
    { facility: "FAC-004", type: "Retail", capacity: "2,000", status: "Maintenance" },
    { facility: "FAC-005", type: "Parking", capacity: "500", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Facility Manager" subtitle="Facility management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
