import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/identity-federation-admin")({
  head: () => ({ meta: [{ title: "Identity Federation Admin — SaaS Vala" }, { name: "description", content: "Identity federation administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: federationData, isLoading, error, refetch } = useQuery({
    queryKey: ["identity-federation-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Identity Federation Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Identity Federation Admin" subtitle="Identity federation administration workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Identity Federation Admin"
          subtitle="Identity federation administration workspace"
          message="We couldn't load Identity Federation Admin data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Federated Identities", value: "50K", delta: "+5K", up: true },
    { label: "Providers Integrated", value: "15", delta: "+2", up: true },
    { label: "SSO Success Rate", value: "99%", delta: "+0.5%", up: true },
    { label: "Sync Errors", value: "2", delta: "-1", up: true },
  ];

  const columns = [
    { key: "provider", label: "Identity Provider" },
    { key: "type", label: "Type" },
    { key: "users", label: "Users" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { provider: "IDP-001", type: "SAML", users: "10K", status: "Active" },
    { provider: "IDP-002", type: "OAuth", users: "15K", status: "Active" },
    { provider: "IDP-003", type: "OIDC", users: "12K", status: "Active" },
    { provider: "IDP-004", type: "LDAP", users: "8K", status: "Active" },
    { provider: "IDP-005", type: "SAML", users: "5K", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Identity Federation Admin" subtitle="Identity federation administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
