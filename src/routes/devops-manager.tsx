import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/devops-manager")({
  head: () => ({ meta: [{ title: "DevOps Manager — SaaS Vala" }, { name: "description", content: "DevOps operations management" }] }),
  component: Page,
});

function Page() {
  const { data: devopsData, isLoading, error, refetch } = useQuery({
    queryKey: ["devops-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch DevOps Manager data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="DevOps Manager" subtitle="DevOps operations management" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="DevOps Manager"
          subtitle="DevOps operations management"
          message="We couldn't load DevOps Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = devopsData?.data;
  const kpis = data?.systemHealth ? [
    { label: "Deployment Success", value: "98.5%", delta: "+1.2%", up: true },
    { label: "Build Time", value: "4.2min", delta: "-0.5min", up: true },
    { label: "Incidents (7d)", value: "2", delta: "-3", up: true },
    { label: "Uptime", value: `${data.systemHealth.uptime}%`, delta: "—", up: data.systemHealth.uptime > 99 },
  ] : [];

  const columns = [
    { key: "service", label: "Service" },
    { key: "status", label: "Status" },
    { key: "deployments", label: "Deployments" },
    { key: "lastDeploy", label: "Last Deploy" },
  ];

  const rows = [
    { service: "API Gateway", status: "Healthy", deployments: "45", lastDeploy: "2h ago" },
    { service: "Web App", status: "Healthy", deployments: "38", lastDeploy: "4h ago" },
    { service: "Background Jobs", status: "Healthy", deployments: "22", lastDeploy: "6h ago" },
    { service: "Database Migrations", status: "Healthy", deployments: "12", lastDeploy: "1d ago" },
    { service: "CDN Updates", status: "Healthy", deployments: "67", lastDeploy: "30m ago" },
  ];

  return (
    <AppShell>
      <ModulePage title="DevOps Manager" subtitle="DevOps operations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
