import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/law-enforcement-dispatch")({
  head: () => ({ meta: [{ title: "Law Enforcement Dispatch — SaaS Vala" }, { name: "description", content: "Law enforcement dispatch workspace" }] }),
  component: Page,
});

function Page() {
  const { data: dispatchData, isLoading, error, refetch } = useQuery({
    queryKey: ["law-enforcement-dispatch-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Law Enforcement Dispatch data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Law Enforcement Dispatch" subtitle="Law enforcement dispatch workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Law Enforcement Dispatch"
          subtitle="Law enforcement dispatch workspace"
          message="We couldn't load Law Enforcement Dispatch data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Calls Today", value: "150", delta: "+20", up: true },
    { label: "Response Time", value: "6min", delta: "-1min", up: true },
    { label: "Units Available", value: "25", delta: "+3", up: true },
    { label: "Priority Response", value: "95%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "call", label: "Dispatch Call" },
    { key: "type", label: "Type" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { call: "DISP-001", type: "Emergency", priority: "Critical", status: "Dispatched" },
    { call: "DISP-002", type: "Non-Emergency", priority: "Low", status: "Queued" },
    { call: "DISP-003", type: "Emergency", priority: "High", status: "In Progress" },
    { call: "DISP-004", type: "Non-Emergency", priority: "Medium", status: "Completed" },
    { call: "DISP-005", type: "Emergency", priority: "Critical", status: "Dispatched" },
  ];

  return (
    <AppShell>
      <ModulePage title="Law Enforcement Dispatch" subtitle="Law enforcement dispatch workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
