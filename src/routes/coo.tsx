import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/coo")({
  head: () => ({ meta: [{ title: "COO Dashboard — SaaS Vala" }, { name: "description", content: "Chief Operating Officer - Operations oversight" }] }),
  component: Page,
});

function Page() {
  const { data: cooData, isLoading, error, refetch } = useQuery({
    queryKey: ["coo-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch COO data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="COO Dashboard" subtitle="Chief Operating Officer - Operations oversight" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="COO Dashboard"
          subtitle="Chief Operating Officer - Operations oversight"
          message="We couldn't load COO data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = cooData?.data;
  const kpis = data?.kpis ? [
    { label: "Operational Efficiency", value: data.kpis.operationalEfficiency || "92%", delta: "+2%", up: true },
    { label: "Active Projects", value: data.kpis.activeProjects?.toString() || "45", delta: "+3", up: true },
    { label: "Team Productivity", value: data.kpis.productivity || "87%", delta: "+5%", up: true },
    { label: "Process Adherence", value: data.kpis.processAdherence || "95%", delta: "+1%", up: true },
  ] : [];

  const columns = [
    { key: "department", label: "Department" },
    { key: "efficiency", label: "Efficiency" },
    { key: "teamSize", label: "Team Size" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { department: "Engineering", efficiency: "94%", teamSize: "45", status: "On Track" },
    { department: "Operations", efficiency: "91%", teamSize: "28", status: "On Track" },
    { department: "Support", efficiency: "88%", teamSize: "32", status: "Needs Attention" },
    { department: "Sales", efficiency: "89%", teamSize: "24", status: "On Track" },
    { department: "Marketing", efficiency: "93%", teamSize: "18", status: "On Track" },
  ];

  return (
    <AppShell>
      <ModulePage title="COO Dashboard" subtitle="Chief Operating Officer - Operations oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
