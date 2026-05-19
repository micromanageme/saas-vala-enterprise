import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/delivery-executive")({
  head: () => ({ meta: [{ title: "Delivery Executive — SaaS Vala" }, { name: "description", content: "Delivery executive workspace" }] }),
  component: Page,
});

function Page() {
  const { data: deliveryData, isLoading, error, refetch } = useQuery({
    queryKey: ["delivery-executive-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Delivery Executive data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Delivery Executive" subtitle="Delivery executive workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Delivery Executive"
          subtitle="Delivery executive workspace"
          message="We couldn't load Delivery Executive data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Deliveries Today", value: "25", delta: "+3", up: true },
    { label: "On-Time Rate", value: "92%", delta: "+3%", up: true },
    { label: "Average Time", value: "8min", delta: "-1min", up: true },
    { label: "Customer Rating", value: "4.8/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "delivery", label: "Delivery ID" },
    { key: "customer", label: "Customer" },
    { key: "eta", label: "ETA" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { delivery: "DLV-001", customer: "John Smith", eta: "5 min", status: "In Transit" },
    { delivery: "DLV-002", customer: "Sarah Johnson", eta: "10 min", status: "In Transit" },
    { delivery: "DLV-003", customer: "Mike Brown", eta: "15 min", status: "Pending" },
    { delivery: "DLV-004", customer: "Emily Davis", eta: "Delivered", status: "Completed" },
    { delivery: "DLV-005", customer: "Alex Wilson", eta: "20 min", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="Delivery Executive" subtitle="Delivery executive workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
