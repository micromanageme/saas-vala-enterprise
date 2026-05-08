import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-compliance")({
  head: () => ({ meta: [{ title: "Root Compliance Command — Universal Access Admin" }, { name: "description", content: "GDPR, ISO, SOC2, HIPAA, audit automation" }] }),
  component: Page,
});

function Page() {
  const { data: complianceData, isLoading, error } = useQuery({
    queryKey: ["root-compliance"],
    queryFn: async () => {
      const response = await fetch("/api/root/compliance?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch compliance data");
      return response.json();
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Compliance Command" subtitle="GDPR, ISO, SOC2, HIPAA, audit automation" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Compliance Command data</div>
      </AppShell>
    );
  }

  const data = complianceData?.data;
  const frameworks = data?.complianceFrameworks || [];
  const automation = data?.auditAutomation;

  const kpis = [
    { label: "Frameworks", value: frameworks.length.toString(), delta: "—", up: true },
    { label: "Compliant", value: frameworks.filter((f: any) => f.status === 'COMPLIANT').length.toString(), delta: "—", up: true },
    { label: "Automated Audits", value: automation?.automatedAudits.toString() || "0", delta: "—", up: true },
    { label: "Total Audits", value: ((automation?.automatedAudits || 0) + (automation?.manualAudits || 0)).toString(), delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "Framework" },
    { key: "status", label: "Status" },
    { key: "lastAudit", label: "Last Audit" },
    { key: "nextAudit", label: "Next Audit" },
  ];

  const rows = frameworks.map((f: any) => ({
    name: f.name,
    status: f.status,
    lastAudit: f.lastAudit ? new Date(f.lastAudit).toLocaleDateString() : "N/A",
    nextAudit: f.nextAudit ? new Date(f.nextAudit).toLocaleDateString() : "N/A",
  }));

  return (
    <AppShell>
      <ModulePage title="Root Compliance Command" subtitle="GDPR, ISO, SOC2, HIPAA, audit automation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
