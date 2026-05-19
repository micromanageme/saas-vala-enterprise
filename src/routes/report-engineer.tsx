import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/report-engineer")({
  head: () => ({ meta: [{ title: "Report Engineer — SaaS Vala" }, { name: "description", content: "Report engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: reportData, isLoading, error, refetch } = useQuery({
    queryKey: ["report-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Report Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Report Engineer" subtitle="Report engineering workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Report Engineer"
          subtitle="Report engineering workspace"
          message="We couldn't load Report Engineer data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Reports Created", value: "12", delta: "+3", up: true },
    { label: "Scheduled Reports", value: "23", delta: "+5", up: true },
    { label: "Subscribers", value: "45", delta: "+8", up: true },
    { label: "Delivery Rate", value: "99.2%", delta: "+0.3%", up: true },
  ];

  const columns = [
    { key: "report", label: "Report" },
    { key: "type", label: "Type" },
    { key: "schedule", label: "Schedule" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { report: "Weekly Sales Summary", type: "PDF", schedule: "Weekly", status: "Active" },
    { report: "Monthly Financials", type: "Excel", schedule: "Monthly", status: "Active" },
    { report: "Daily Operations", type: "Email", schedule: "Daily", status: "Active" },
    { report: "Q3 Performance", type: "Dashboard", schedule: "Quarterly", status: "Scheduled" },
    { report: "Custom Analytics", type: "PDF", schedule: "On Demand", status: "Draft" },
  ];

  return (
    <AppShell>
      <ModulePage title="Report Engineer" subtitle="Report engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
