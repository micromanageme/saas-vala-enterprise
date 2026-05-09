import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-identity")({
  head: () => ({ meta: [{ title: "Universal Identity Fabric — Universal Access Admin" }, { name: "description", content: "Federated identities, SSO mesh, cross-domain mapping" }] }),
  component: Page,
});

function Page() {
  const { data: identityData, isLoading, error } = useQuery({
    queryKey: ["root-identity"],
    queryFn: async () => {
      const response = await fetch("/api/root/identity-fabric?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch identity fabric data");
      return response.json();
    },
    refetchInterval: 20000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Identity Fabric" subtitle="Federated identities, SSO mesh, cross-domain mapping" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Identity Fabric data</div>
      </AppShell>
    );
  }

  const data = identityData?.data;
  const identities = data?.federatedIdentities || [];
  const sso = data?.ssoMesh;

  const kpis = sso ? [
    { label: "Providers", value: sso.totalProviders.toString(), delta: "—", up: true },
    { label: "Active", value: sso.activeProviders.toString(), delta: "—", up: true },
    { label: "Failed", value: sso.failedProviders.toString(), delta: "—", up: sso.failedProviders === 0 },
  ];

  const columns = [
    { key: "provider", label: "Provider" },
    { key: "userId", label: "User ID" },
    { key: "status", label: "Status" },
    { key: "lastSync", label: "Last Sync" },
  ];

  const rows = identities.map((i: any) => ({
    provider: i.provider,
    userId: i.userId,
    status: i.status,
    lastSync: new Date(i.lastSync).toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Identity Fabric" subtitle="Federated identities, SSO mesh, cross-domain mapping" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
