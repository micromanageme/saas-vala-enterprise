import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/farm-operations-manager")({
  head: () => ({ meta: [{ title: "Farm Operations Manager — SaaS Vala" }, { name: "description", content: "Farm operations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: farmData, isLoading, error } = useQuery({
    queryKey: ["farm-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Farm Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Farm Operations Manager" subtitle="Farm operations management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Farm Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Equipment Utilization", value: "85%", delta: "+3%", up: true },
    { label: "Labor Hours", value: "2.5K", delta: "+200", up: true },
    { label: "Productivity Rate", value: "94%", delta: "+2%", up: true },
    { label: "Maintenance Costs", value: "$45K", delta: "-$5K", up: true },
  ];

  const columns = [
    { key: "equipment", label: "Farm Equipment" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "location", label: "Location" },
  ];

  const rows = [
    { equipment: "EQ-001", type: "Tractor", status: "Active", location: "Field A" },
    { equipment: "EQ-002", type: "Harvester", status: "Active", location: "Field B" },
    { equipment: "EQ-003", type: "Irrigation", status: "Active", location: "Field C" },
    { equipment: "EQ-004", type: "Sprayer", status: "Maintenance", location: "Field D" },
    { equipment: "EQ-005", type: "Plow", status: "Active", location: "Field E" },
  ];

  return (
    <AppShell>
      <ModulePage title="Farm Operations Manager" subtitle="Farm operations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
