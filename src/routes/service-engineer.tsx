import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/service-engineer")({
  head: () => ({ meta: [{ title: "Service Engineer — SaaS Vala" }, { name: "description", content: "Service engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: serviceData, isLoading, error } = useQuery({
    queryKey: ["service-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Service Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Service Engineer" subtitle="Service engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Service Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Service Calls", value: "125", delta: "+15", up: true },
    { label: "Repairs Completed", value: "110", delta: "+12", up: true },
    { label: "Resolution Time", value: "2.5h", delta: "-30min", up: true },
    { label: "Satisfaction", value: "4.6/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "ticket", label: "Service Ticket" },
    { key: "equipment", label: "Equipment" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { ticket: "SRV-001", equipment: "HVAC Unit", priority: "High", status: "In Progress" },
    { ticket: "SRV-002", equipment: "Generator", priority: "Critical", status: "In Progress" },
    { ticket: "SRV-003", equipment: "Pump", priority: "Medium", status: "Completed" },
    { ticket: "SRV-004", equipment: "Controller", priority: "Low", status: "Pending" },
    { ticket: "SRV-005", equipment: "Motor", priority: "High", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Service Engineer" subtitle="Service engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
