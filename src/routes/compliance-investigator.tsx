import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/compliance-investigator")({
  head: () => ({ meta: [{ title: "Compliance Investigator — SaaS Vala" }, { name: "description", content: "Compliance investigation workspace" }] }),
  component: Page,
});

function Page() {
  const { data: complianceData, isLoading, error } = useQuery({
    queryKey: ["compliance-investigator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Compliance Investigator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Compliance Investigator" subtitle="Compliance investigation workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Compliance Investigator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Open Investigations", value: "6", delta: "+1", up: true },
    { label: "Compliance Score", value: "94%", delta: "+2%", up: true },
    { label: "Violations Found", value: "3", delta: "-1", up: true },
    { label: "Remediation Rate", value: "88%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "investigation", label: "Investigation" },
    { key: "regulation", label: "Regulation" },
    { key: "risk", label: "Risk Level" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { investigation: "GDPR Compliance Audit", regulation: "GDPR", risk: "Medium", status: "In Progress" },
    { investigation: "SOX Review", regulation: "SOX", risk: "High", status: "Active" },
    { investigation: "HIPAA Assessment", regulation: "HIPAA", risk: "Critical", status: "Review" },
    { investigation: "PCI DSS Audit", regulation: "PCI DSS", risk: "Medium", status: "Pending" },
    { investigation: "ISO 27001 Review", regulation: "ISO 27001", risk: "Low", status: "Scheduled" },
  ];

  return (
    <AppShell>
      <ModulePage title="Compliance Investigator" subtitle="Compliance investigation workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
