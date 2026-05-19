import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/utilities-manager")({
  head: () => ({ meta: [{ title: "Utilities Manager — SaaS Vala" }, { name: "description", content: "Utilities management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: utilitiesData, isLoading, error, refetch } = useQuery({
    queryKey: ["utilities-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Utilities Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Utilities Manager" subtitle="Utilities management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Utilities Manager"
          subtitle="Utilities management workspace"
          message="We couldn't load Utilities Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Services Provided", value: "8", delta: "0", up: true },
    { label: "Customers Served", value: "250K", delta: "+5K", up: true },
    { label: "Service Reliability", value: "99.2%", delta: "+0.3%", up: true },
    { label: "Response Time", value: "45min", delta: "-5min", up: true },
  ];

  const columns = [
    { key: "utility", label: "Utility Service" },
    { key: "customers", label: "Customers" },
    { key: "uptime", label: "Uptime" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { utility: "Electricity", customers: "250K", uptime: "99.5%", status: "Active" },
    { utility: "Water", customers: "250K", uptime: "99.8%", status: "Active" },
    { utility: "Gas", customers: "180K", uptime: "99.2%", status: "Active" },
    { utility: "Sewage", customers: "250K", uptime: "98.5%", status: "Active" },
    { utility: "Internet", customers: "220K", uptime: "99.0%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Utilities Manager" subtitle="Utilities management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
