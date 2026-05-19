import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-trust")({
  head: () => ({ meta: [{ title: "Root Trust Engine — Universal Access Admin" }, { name: "description", content: "Trust scoring, device validation, behavioral anomaly" }] }),
  component: Page,
});

function Page() {
  const { data: trustData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-trust"],
    queryFn: async () => {
      const response = await fetch("/api/root/trust-engine?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch trust engine data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Root Trust Engine" subtitle="Trust scoring, device validation, behavioral anomaly" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Root Trust Engine"
          subtitle="Trust scoring, device validation, behavioral anomaly"
          message="We couldn't load Root Trust Engine data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = trustData?.data;
  const scores = data?.trustScores || [];
  const deviceTrust = data?.deviceTrust;

  const kpis = deviceTrust ? [
    { label: "Total Devices", value: deviceTrust.totalDevices.toString(), delta: "—", up: true },
    { label: "Trusted", value: deviceTrust.trustedDevices.toString(), delta: "—", up: true },
    { label: "Untrusted", value: deviceTrust.untrustedDevices.toString(), delta: "—", up: deviceTrust.untrustedDevices === 0 },
  ] : [];

  const columns = [
    { key: "userId", label: "User ID" },
    { key: "score", label: "Score" },
    { key: "level", label: "Level" },
    { key: "lastUpdated", label: "Last Updated" },
  ];

  const rows = scores.map((s: any) => ({
    userId: s.userId,
    score: s.score.toString(),
    level: s.level,
    lastUpdated: new Date(s.lastUpdated).toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Root Trust Engine" subtitle="Trust scoring, device validation, behavioral anomaly" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
