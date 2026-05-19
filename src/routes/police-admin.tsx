import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/police-admin")({
  head: () => ({ meta: [{ title: "Police Admin — SaaS Vala" }, { name: "description", content: "Police administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: policeData, isLoading, error, refetch } = useQuery({
    queryKey: ["police-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Police Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Police Admin" subtitle="Police administration workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Police Admin"
          subtitle="Police administration workspace"
          message="We couldn't load Police Admin data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Officers Active", value: "250", delta: "+20", up: true },
    { label: "Cases Open", value: "450", delta: "+30", up: true },
    { label: "Clearance Rate", value: "72%", delta: "+3%", up: true },
    { label: "Response Time", value: "8min", delta: "-1min", up: true },
  ];

  const columns = [
    { key: "precinct", label: "Police Precinct" },
    { key: "officers", label: "Officers" },
    { key: "cases", label: "Active Cases" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { precinct: "PREC-001", officers: "50", cases: "80", status: "Active" },
    { precinct: "PREC-002", officers: "40", cases: "70", status: "Active" },
    { precinct: "PREC-003", officers: "45", cases: "75", status: "Active" },
    { precinct: "PREC-004", officers: "35", cases: "60", status: "Active" },
    { precinct: "PREC-005", officers: "30", cases: "50", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="Police Admin" subtitle="Police administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
