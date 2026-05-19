import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/citizen-service-manager")({
  head: () => ({ meta: [{ title: "Citizen Service Manager — SaaS Vala" }, { name: "description", content: "Citizen service management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: citizenData, isLoading, error, refetch } = useQuery({
    queryKey: ["citizen-service-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Citizen Service Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Citizen Service Manager" subtitle="Citizen service management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Citizen Service Manager"
          subtitle="Citizen service management workspace"
          message="We couldn't load Citizen Service Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Service Requests", value: "580", delta: "+45", up: true },
    { label: "Resolved Today", value: "125", delta: "+20", up: true },
    { label: "CSAT Score", value: "4.5/5", delta: "+0.1", up: true },
    { label: "Avg Response Time", value: "2.5h", delta: "-0.5h", up: true },
  ];

  const columns = [
    { key: "request", label: "Service Request" },
    { key: "citizen", label: "Citizen" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { request: "SR-2024-001", citizen: "John Smith", priority: "High", status: "In Progress" },
    { request: "SR-2024-002", citizen: "Sarah Johnson", priority: "Medium", status: "Pending" },
    { request: "SR-2024-003", citizen: "Mike Brown", priority: "Low", status: "Resolved" },
    { request: "SR-2024-004", citizen: "Emily Davis", priority: "Critical", status: "Active" },
    { request: "SR-2024-005", citizen: "Alex Wilson", priority: "Medium", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Citizen Service Manager" subtitle="Citizen service management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
