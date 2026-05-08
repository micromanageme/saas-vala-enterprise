import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-audit")({
  head: () => ({ meta: [{ title: "Universal Audit Vault — Universal Access Admin" }, { name: "description", content: "Immutable audit logs, forensic tracking, compliance export" }] }),
  component: Page,
});

function Page() {
  const { data: auditData, isLoading, error } = useQuery({
    queryKey: ["root-audit"],
    queryFn: async () => {
      const response = await fetch("/api/root/audit-vault?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch audit vault data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Audit Vault" subtitle="Immutable audit logs, forensic tracking, compliance export" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Audit Vault data</div>
      </AppShell>
    );
  }

  const data = auditData?.data;
  const logs = data?.auditLogs || [];
  const forensic = data?.forensicTracking;

  const kpis = forensic ? [
    { label: "Total Logs", value: forensic.totalLogs.toLocaleString(), delta: "—", up: true },
    { label: "Tamper Detected", value: forensic.tamperDetected ? "Yes" : "No", delta: "—", up: !forensic.tamperDetected },
    { label: "Chain of Trust", value: forensic.chainOfTrust, delta: "—", up: forensic.chainOfTrust === 'VALID' },
    { label: "Logs Shown", value: logs.length.toString(), delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "action", label: "Action" },
    { key: "entity", label: "Entity" },
    { key: "user", label: "User" },
    { key: "timestamp", label: "Timestamp" },
  ];

  const rows = logs.slice(0, 20).map((l: any) => ({
    action: l.action,
    entity: l.entity,
    user: l.user,
    timestamp: new Date(l.timestamp).toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Audit Vault" subtitle="Immutable audit logs, forensic tracking, compliance export" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
