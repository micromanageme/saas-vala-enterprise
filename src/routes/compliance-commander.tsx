import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/compliance-commander")({
  head: () => ({ meta: [{ title: "Compliance Commander — SaaS Vala" }, { name: "description", content: "Compliance command center" }] }),
  component: Page,
});

function Page() {
  const { data: complianceData, isLoading, error } = useQuery({
    queryKey: ["compliance-commander-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Compliance Commander data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Compliance Commander" subtitle="Compliance command center" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Compliance Commander data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Overall Compliance", value: "96%", delta: "+2%", up: true },
    { label: "Frameworks Active", value: "8", delta: "+1", up: true },
    { label: "Audits Passed", value: "12", delta: "+2", up: true },
    { label: "Risk Level", value: "Low", delta: "—", up: true },
  ];

  const columns = [
    { key: "framework", label: "Compliance Framework" },
    { key: "score", label: "Score" },
    { key: "status", label: "Status" },
    { key: "nextAudit", label: "Next Audit" },
  ];

  const rows = [
    { framework: "SOC 2 Type II", score: "98%", status: "Compliant", nextAudit: "2025-06-01" },
    { framework: "ISO 27001", score: "96%", status: "Compliant", nextAudit: "2025-03-15" },
    { framework: "GDPR", score: "95%", status: "Compliant", nextAudit: "2025-01-15" },
    { framework: "HIPAA", score: "97%", status: "Compliant", nextAudit: "2025-05-01" },
    { framework: "PCI DSS", score: "94%", status: "Compliant", nextAudit: "2025-04-01" },
  ];

  return (
    <AppShell>
      <ModulePage title="Compliance Commander" subtitle="Compliance command center" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
