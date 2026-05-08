import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/document-forensics-analyst")({
  head: () => ({ meta: [{ title: "Document Forensics Analyst — SaaS Vala" }, { name: "description", content: "Document forensics analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: forensicsData, isLoading, error } = useQuery({
    queryKey: ["document-forensics-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Document Forensics Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Document Forensics Analyst" subtitle="Document forensics analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Document Forensics Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Documents Analyzed", value: "150", delta: "+15", up: true },
    { label: "Authenticity Verified", value: "95%", delta: "+2%", up: true },
    { label: "Forgeries Detected", value: "5", delta: "+1", up: false },
    { label: "Chain of Custody", value: "100%", delta: "0%", up: true },
  ];

  const columns = [
    { key: "case", label: "Forensic Case" },
    { key: "type", label: "Document Type" },
    { key: "result", label: "Analysis Result" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { case: "FOR-001", type: "Contract", result: "Authentic", status: "Completed" },
    { case: "FOR-002", type: "Certificate", result: "In Review", status: "In Progress" },
    { case: "FOR-003", type: "Invoice", result: "Authentic", status: "Completed" },
    { case: "FOR-004", type: "Will", result: "Suspicious", status: "Investigating" },
    { case: "FOR-005", type: "License", result: "Authentic", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Document Forensics Analyst" subtitle="Document forensics analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
