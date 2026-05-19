import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/secrets-manager")({
  head: () => ({ meta: [{ title: "Secrets Manager — SaaS Vala" }, { name: "description", content: "Secrets management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: secretsData, isLoading, error, refetch } = useQuery({
    queryKey: ["secrets-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Secrets Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Secrets Manager" subtitle="Secrets management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Secrets Manager"
          subtitle="Secrets management workspace"
          message="We couldn't load Secrets Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Secrets Stored", value: "500", delta: "+50", up: true },
    { label: "Rotations", value: "95%", delta: "+2%", up: true },
    { label: "Access Attempts", value: "10K", delta: "+1K", up: true },
    { label: "Violations", value: "0", delta: "0", up: true },
  ];

  const columns = [
    { key: "secret", label: "Secret" },
    { key: "type", label: "Type" },
    { key: "rotation", label: "Rotation" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { secret: "SEC-001", type: "API Key", rotation: "30 days", status: "Active" },
    { secret: "SEC-002", type: "Password", rotation: "90 days", status: "Active" },
    { secret: "SEC-003", type: "Certificate", rotation: "365 days", status: "Active" },
    { secret: "SEC-004", type: "Token", rotation: "7 days", status: "Expiring Soon" },
    { secret: "SEC-005", type: "Key", rotation: "180 days", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Secrets Manager" subtitle="Secrets management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
