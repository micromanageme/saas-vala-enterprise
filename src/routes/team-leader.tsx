import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/team-leader")({
  head: () => ({ meta: [{ title: "Team Leader — SaaS Vala" }, { name: "description", content: "Team leadership" }] }),
  component: Page,
});

function Page() {
  const { data: teamLeadData, isLoading, error, refetch } = useQuery({
    queryKey: ["team-leader-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Team Leader data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Team Leader" subtitle="Team leadership" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Team Leader"
          subtitle="Team leadership"
          message="We couldn't load Team Leader data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Team Size", value: "12", delta: "+2", up: true },
    { label: "Tasks Assigned", value: "23", delta: "+5", up: true },
    { label: "Tasks Completed", value: "18", delta: "+4", up: true },
    { label: "Team Performance", value: "92%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "member", label: "Member" },
    { key: "tasks", label: "Tasks" },
    { key: "completed", label: "Completed" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { member: "John Smith", tasks: "5", completed: "4", status: "Active" },
    { member: "Sarah Johnson", tasks: "4", completed: "4", status: "Active" },
    { member: "Mike Brown", tasks: "6", completed: "5", status: "Active" },
    { member: "Emily Davis", tasks: "4", completed: "3", status: "On Leave" },
    { member: "Alex Wilson", tasks: "4", completed: "2", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Team Leader" subtitle="Team leadership" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
