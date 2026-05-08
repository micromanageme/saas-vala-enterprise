import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/compliance-officer")({
  head: () => ({ meta: [{ title: "Compliance Officer — SaaS Vala" }, { name: "description", content: "Compliance management" }] }),
  component: Page,
});

function Page() {
  const { data: complianceData, isLoading, error } = useQuery({
    queryKey: ["compliance-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Compliance Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Compliance Officer" subtitle="Compliance management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Compliance Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Compliance Score", value: "96%", delta: "+2%", up: true },
    { label: "Open Issues", value: "3", delta: "-2", up: true },
    { label: "Audits Passed", value: "12", delta: "+1", up: true },
    { label: "Risk Level", value: "Low", delta: "—", up: true },
  ];

  const columns = [
    { key: "framework", label: "Framework" },
    { key: "status", label: "Status" },
    { key: "lastAudit", label: "Last Audit" },
    { key: "nextAudit", label: "Next Audit" },
  ];

  const rows = [
    { framework: "SOC 2", status: "Compliant", lastAudit: "2024-06-01", nextAudit: "2025-06-01" },
    { framework: "ISO 27001", status: "Compliant", lastAudit: "2024-03-15", nextAudit: "2025-03-15" },
    { framework: "HIPAA", status: "Compliant", lastAudit: "2024-05-01", nextAudit: "2025-05-01" },
    { framework: "PCI DSS", status: "Compliant", lastAudit: "2024-04-01", nextAudit: "2025-04-01" },
    { framework: "GDPR", status: "Compliant", lastAudit: "2024-01-15", nextAudit: "2025-01-15" },
  ];

  return (
    <AppShell>
      <ModulePage title="Compliance Officer" subtitle="Compliance management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
