import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ai-compliance-auditor")({
  head: () => ({ meta: [{ title: "AI Compliance Auditor — SaaS Vala" }, { name: "description", content: "AI compliance auditing" }] }),
  component: Page,
});

function Page() {
  const { data: auditData, isLoading, error } = useQuery({
    queryKey: ["ai-compliance-auditor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch AI Compliance Auditor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="AI Compliance Auditor" subtitle="AI compliance auditing" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load AI Compliance Auditor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Audits Completed", value: "8", delta: "+2", up: true },
    { label: "Compliance Rate", value: "96%", delta: "+2%", up: true },
    { label: "Findings", value: "5", delta: "-2", up: true },
    { label: "Remediation", value: "80%", delta: "+10%", up: true },
  ];

  const columns = [
    { key: "audit", label: "Audit" },
    { key: "framework", label: "Framework" },
    { key: "result", label: "Result" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { audit: "Model Governance", framework: "Internal", result: "Pass", status: "Complete" },
    { audit: "EU AI Act", framework: "EU AI Act", result: "Pass", status: "Complete" },
    { audit: "NIST AI RMF", framework: "NIST", result: "Pass", status: "In Progress" },
    { audit: "ISO 42001", framework: "ISO", result: "Pass", status: "Complete" },
    { audit: "Data Privacy", framework: "GDPR", result: "Review", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="AI Compliance Auditor" subtitle="AI compliance auditing" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
