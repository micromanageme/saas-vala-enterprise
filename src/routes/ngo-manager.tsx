import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ngo-manager")({
  head: () => ({ meta: [{ title: "NGO Manager — SaaS Vala" }, { name: "description", content: "NGO management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: ngoData, isLoading, error, refetch } = useQuery({
    queryKey: ["ngo-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch NGO Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="NGO Manager" subtitle="NGO management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="NGO Manager"
          subtitle="NGO management workspace"
          message="We couldn't load NGO Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Projects Active", value: "25", delta: "+3", up: true },
    { label: "Beneficiaries Served", value: "5.2K", delta: "+500", up: true },
    { label: "Funds Utilized", value: "$450K", delta: "+$50K", up: true },
    { label: "Volunteers", value: "350", delta: "+30", up: true },
  ];

  const columns = [
    { key: "project", label: "NGO Project" },
    { key: "cause", label: "Cause" },
    { key: "beneficiaries", label: "Beneficiaries" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "PROJ-001", cause: "Education", beneficiaries: "500", status: "Active" },
    { project: "PROJ-002", cause: "Healthcare", beneficiaries: "800", status: "Active" },
    { project: "PROJ-003", cause: "Housing", beneficiaries: "300", status: "Active" },
    { project: "PROJ-004", cause: "Food Security", beneficiaries: "1,200", status: "In Progress" },
    { project: "PROJ-005", cause: "Environment", beneficiaries: "400", status: "Planning" },
  ];

  return (
    <AppShell>
      <ModulePage title="NGO Manager" subtitle="NGO management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
