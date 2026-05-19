import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/system-architect")({
  head: () => ({ meta: [{ title: "System Architect — SaaS Vala" }, { name: "description", content: "System architecture oversight" }] }),
  component: Page,
});

function Page() {
  const { data: archData, isLoading, error, refetch } = useQuery({
    queryKey: ["system-architect-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch System Architect data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="System Architect" subtitle="System architecture oversight" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="System Architect"
          subtitle="System architecture oversight"
          message="We couldn't load System Architect data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Architecture Decisions", value: "12", delta: "+2", up: true },
    { label: "Technical Debt", value: "Low", delta: "—", up: true },
    { label: "System Scalability", value: "95%", delta: "+2%", up: true },
    { label: "Documentation", value: "88%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "system", label: "System" },
    { key: "status", label: "Status" },
    { key: "version", label: "Version" },
    { key: "nextUpdate", label: "Next Update" },
  ];

  const rows = [
    { system: "Core Platform", status: "Stable", version: "v2.4.1", nextUpdate: "2 weeks" },
    { system: "API Gateway", status: "Stable", version: "v3.1.0", nextUpdate: "1 week" },
    { system: "Database Schema", status: "Stable", version: "v1.8.5", nextUpdate: "3 weeks" },
    { system: "Microservices", status: "Stable", version: "v2.0.0", nextUpdate: "2 weeks" },
    { system: "Authentication", status: "Stable", version: "v1.5.2", nextUpdate: "1 month" },
  ];

  return (
    <AppShell>
      <ModulePage title="System Architect" subtitle="System architecture oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
