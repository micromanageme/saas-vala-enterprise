import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit Logs — SaaS Vala" }, { name: "description", content: "Security & traceability" }] }),
  component: Page,
});

function Page() {
  const { data: securityData, isLoading } = useQuery({
    queryKey: ["admin-security"],
    queryFn: async () => {
      const response = await fetch("/api/admin/security");
      if (!response.ok) {
        throw new Error("Failed to fetch security data");
      }
      return response.json();
    },
  });

  const failedLogins = securityData?.security?.threats?.failedLogins || 0;
  const suspiciousActivities = securityData?.security?.threats?.suspiciousActivities || 0;
  const recentSuspensions = securityData?.security?.threats?.recentSuspensions || 0;
  const auditLogs = securityData?.security?.auditLogs?.recent || [];
  
  const kpis = [
    { label: "Failed Logins (24h)", value: failedLogins.toString(), delta: "—", up: false },
    { label: "Suspicious (24h)", value: suspiciousActivities.toString(), delta: "—", up: false },
    { label: "Suspensions (7d)", value: recentSuspensions.toString(), delta: "—", up: false },
    { label: "Audit Events", value: auditLogs.length.toString(), delta: "—", up: true }
  ];
  
  const columns = [{ key: "ts", label: "Timestamp" }, { key: "user", label: "User" }, { key: "action", label: "Action" }, { key: "ip", label: "IP" }];
  const rows = auditLogs.slice(0, 10).map((log: any) => ({
    "ts": new Date(log.createdAt).toLocaleTimeString(),
    "user": log.user?.displayName || "System",
    "action": log.action,
    "ip": log.metadata?.ip || "—"
  }));

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Audit Logs" subtitle="Security & traceability" kpis={kpis} columns={columns} rows={[]} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ModulePage title="Audit Logs" subtitle="Security & traceability" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
