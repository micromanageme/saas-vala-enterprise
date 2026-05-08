import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/compliance-forensics-reviewer")({
  head: () => ({ meta: [{ title: "Compliance Forensics Reviewer — SaaS Vala" }, { name: "description", content: "Compliance forensics review workspace" }] }),
  component: Page,
});

function Page() {
  const { data: complianceData, isLoading, error } = useQuery({
    queryKey: ["compliance-forensics-reviewer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Compliance Forensics Reviewer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Compliance Forensics Reviewer" subtitle="Compliance forensics review workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Compliance Forensics Reviewer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Reviews Completed", value: "75", delta: "+8", up: true },
    { label: "Compliance Rate", value: "96%", delta: "+2%", up: true },
    { label: "Findings", value: "12", delta: "+2", up: false },
    { label: "Remediation", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "review", label: "Compliance Review" },
    { key: "standard", label: "Standard" },
    { key: "finding", label: "Finding" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { review: "REV-001", standard: "ISO 27001", finding: "Minor", status: "Resolved" },
    { review: "REV-002", standard: "SOC 2", finding: "None", status: "Passed" },
    { review: "REV-003", standard: "GDPR", finding: "Minor", status: "In Progress" },
    { review: "REV-004", standard: "PCI DSS", finding: "None", status: "Passed" },
    { review: "REV-005", standard: "HIPAA", finding: "Minor", status: "Resolved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Compliance Forensics Reviewer" subtitle="Compliance forensics review workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
