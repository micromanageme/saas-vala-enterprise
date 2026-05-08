import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/maintenance-manager")({
  head: () => ({ meta: [{ title: "Maintenance Manager — SaaS Vala" }, { name: "description", content: "Maintenance management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: maintenanceData, isLoading, error } = useQuery({
    queryKey: ["maintenance-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Maintenance Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Maintenance Manager" subtitle="Maintenance management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Maintenance Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Pending Work Orders", value: "45", delta: "-5", up: true },
    { label: "Preventive Maintenance", value: "85%", delta: "+3%", up: true },
    { label: "Equipment Availability", value: "94%", delta: "+1%", up: true },
    { label: "MTTR", value: "4h", delta: "-0.5h", up: true },
  ];

  const columns = [
    { key: "equipment", label: "Equipment" },
    { key: "type", label: "Maintenance Type" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { equipment: "CNC Machine 01", type: "Preventive", priority: "Medium", status: "Scheduled" },
    { equipment: "Conveyor Belt A", type: "Corrective", priority: "High", status: "In Progress" },
    { equipment: "Hydraulic Press 03", type: "Predictive", priority: "Critical", status: "Active" },
    { equipment: "Robot Arm 05", type: "Preventive", priority: "Medium", status: "Completed" },
    { equipment: "Packaging Unit 02", type: "Corrective", priority: "Low", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="Maintenance Manager" subtitle="Maintenance management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
