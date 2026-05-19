import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/robotics-operations-manager")({
  head: () => ({ meta: [{ title: "Robotics Operations Manager — SaaS Vala" }, { name: "description", content: "Robotics operations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: roboticsData, isLoading, error, refetch } = useQuery({
    queryKey: ["robotics-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Robotics Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Robotics Operations Manager" subtitle="Robotics operations management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Robotics Operations Manager"
          subtitle="Robotics operations management workspace"
          message="We couldn't load Robotics Operations Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Robots", value: "35", delta: "+3", up: true },
    { label: "Automation Rate", value: "78%", delta: "+4%", up: true },
    { label: "Robot Uptime", value: "98.5%", delta: "+0.3%", up: true },
    { label: "Tasks Completed", value: "2.5K", delta: "+300", up: true },
  ];

  const columns = [
    { key: "robot", label: "Robot" },
    { key: "type", label: "Type" },
    { key: "tasks", label: "Tasks/Hour" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { robot: "RB-001 (Arm)", type: "Assembly", tasks: "45", status: "Active" },
    { robot: "RB-002 (Arm)", type: "Welding", tasks: "35", status: "Active" },
    { robot: "RB-003 (AGV)", type: "Transport", tasks: "60", status: "Active" },
    { robot: "RB-004 (Arm)", type: "Painting", tasks: "40", status: "Maintenance" },
    { robot: "RB-005 (AGV)", type: "Logistics", tasks: "55", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Robotics Operations Manager" subtitle="Robotics operations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
