import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-security")({
  head: () => ({ meta: [{ title: "Universal Security Center — Universal Access Admin" }, { name: "description", content: "Root-level security control" }] }),
  component: Page,
});

function Page() {
  const { data: securityData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-security"],
    queryFn: async () => {
      const response = await fetch("/api/root/security?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch security data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Universal Security Center" subtitle="Root-level security control" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Universal Security Center"
          subtitle="Root-level security control"
          message="We couldn't load Universal Security Center data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = securityData?.data;
  const threats = data?.threats || [];
  const siem = data?.siem;

  const kpis = siem ? [
    { label: "Total Events", value: siem.totalEvents.toLocaleString(), delta: "—", up: true },
    { label: "Critical", value: siem.criticalEvents.toString(), delta: "—", up: false },
    { label: "High", value: siem.highEvents.toString(), delta: "—", up: false },
    { label: "Medium", value: siem.mediumEvents.toString(), delta: "—", up: false },
  ] : [];

  const columns = [
    { key: "type", label: "Type" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
    { key: "source", label: "Source" },
    { key: "timestamp", label: "Timestamp" },
  ];

  const rows = threats.map((t: any) => ({
    type: t.type,
    severity: t.severity,
    status: t.status,
    source: t.source,
    timestamp: new Date(t.timestamp).toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Security Center" subtitle="Root-level security control" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
