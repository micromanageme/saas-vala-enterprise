import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/donor-manager")({
  head: () => ({ meta: [{ title: "Donor Manager — SaaS Vala" }, { name: "description", content: "Donor management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: donorData, isLoading, error, refetch } = useQuery({
    queryKey: ["donor-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Donor Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Donor Manager" subtitle="Donor management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Donor Manager"
          subtitle="Donor management workspace"
          message="We couldn't load Donor Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Donors", value: "450", delta: "+50", up: true },
    { label: "Donations Received", value: "$250K", delta: "+$30K", up: true },
    { label: "Recurring Donors", value: "65%", delta: "+5%", up: true },
    { label: "Engagement Rate", value: "78%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "donor", label: "Donor" },
    { key: "type", label: "Type" },
    { key: "total", label: "Total Donated" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { donor: "John Smith", type: "Individual", total: "$5,000", status: "Active" },
    { donor: "Sarah Johnson", type: "Corporate", total: "$25,000", status: "Active" },
    { donor: "Mike Brown", type: "Individual", total: "$2,500", status: "Active" },
    { donor: "Emily Davis", type: "Foundation", total: "$50,000", status: "Active" },
    { donor: "Alex Wilson", type: "Individual", total: "$1,000", status: "Lapsed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Donor Manager" subtitle="Donor management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
