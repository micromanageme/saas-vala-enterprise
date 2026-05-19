import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/workforce-planner")({
  head: () => ({ meta: [{ title: "Workforce Planner — SaaS Vala" }, { name: "description", content: "Workforce planning workspace" }] }),
  component: Page,
});

function Page() {
  const { data: workforceData, isLoading, error, refetch } = useQuery({
    queryKey: ["workforce-planner-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Workforce Planner data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Workforce Planner" subtitle="Workforce planning workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Workforce Planner"
          subtitle="Workforce planning workspace"
          message="We couldn't load Workforce Planner data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total Workforce", value: "450", delta: "+25", up: true },
    { label: "Open Positions", value: "35", delta: "-5", up: true },
    { label: "Utilization Rate", value: "85%", delta: "+3%", up: true },
    { label: "Retention Rate", value: "92%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "department", label: "Department" },
    { key: "headcount", label: "Headcount" },
    { key: "hiring", label: "Hiring" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { department: "Engineering", headcount: "120", hiring: "15", status: "Growing" },
    { department: "Sales", headcount: "80", hiring: "8", status: "Stable" },
    { department: "Operations", headcount: "65", hiring: "5", status: "Stable" },
    { department: "Marketing", headcount: "45", hiring: "4", status: "Growing" },
    { department: "Support", headcount: "50", hiring: "3", status: "Stable" },
  ];

  return (
    <AppShell>
      <ModulePage title="Workforce Planner" subtitle="Workforce planning workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
