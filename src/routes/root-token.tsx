import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-token")({
  head: () => ({ meta: [{ title: "Root Token Authority — Universal Access Admin" }, { name: "description", content: "Token minting, revocation, JWT lifecycle, session token graph" }] }),
  component: Page,
});

function Page() {
  const { data: tokenData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-token"],
    queryFn: async () => {
      const response = await fetch("/api/root/token-authority?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch token authority data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Root Token Authority" subtitle="Token minting, revocation, JWT lifecycle, session token graph" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Root Token Authority"
          subtitle="Token minting, revocation, JWT lifecycle, session token graph"
          message="We couldn't load Root Token Authority data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = tokenData?.data;
  const tokens = data?.activeTokens || [];
  const revocation = data?.tokenRevocation;

  const kpis = revocation ? [
    { label: "Total Tokens", value: revocation.totalTokens.toLocaleString(), delta: "—", up: true },
    { label: "Active", value: revocation.activeTokens.toString(), delta: "—", up: true },
    { label: "Revoked", value: revocation.revokedTokens.toLocaleString(), delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "userId", label: "User ID" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" },
  ];

  const rows = tokens.slice(0, 20).map((t: any) => ({
    userId: t.userId,
    type: t.type,
    status: t.status,
    createdAt: new Date(t.createdAt).toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Root Token Authority" subtitle="Token minting, revocation, JWT lifecycle, session token graph" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
