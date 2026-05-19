import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/field-technician")({
  head: () => ({ meta: [{ title: "Field Technician — SaaS Vala" }, { name: "description", content: "Field technician workspace" }] }),
  component: Page,
});

function Page() {
  const { data: techData, isLoading, error, refetch } = useQuery({
    queryKey: ["field-technician-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Field Technician data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Field Technician" subtitle="Field technician workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Field Technician"
          subtitle="Field technician workspace"
          message="We couldn't load Field Technician data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tasks Today", value: "8", delta: "+2", up: true },
    { label: "Tasks Completed", value: "6", delta: "+1", up: true },
    { label: "Travel Time", value: "1.5h", delta: "-30min", up: true },
    { label: "Efficiency", value: "92%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "task", label: "Task" },
    { key: "customer", label: "Customer" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { task: "TSK-001", customer: "John Smith", location: "123 Main St", status: "Completed" },
    { task: "TSK-002", customer: "Sarah Johnson", location: "456 Oak Ave", status: "In Progress" },
    { task: "TSK-003", customer: "Mike Brown", location: "789 Pine Rd", status: "Scheduled" },
    { task: "TSK-004", customer: "Emily Davis", location: "321 Elm St", status: "Completed" },
    { task: "TSK-005", customer: "Alex Wilson", location: "654 Maple Dr", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Field Technician" subtitle="Field technician workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
