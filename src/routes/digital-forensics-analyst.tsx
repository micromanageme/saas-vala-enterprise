import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/digital-forensics-analyst")({
  head: () => ({ meta: [{ title: "Digital Forensics Analyst — SaaS Vala" }, { name: "description", content: "Digital forensics workspace" }] }),
  component: Page,
});

function Page() {
  const { data: forensicsData, isLoading, error } = useQuery({
    queryKey: ["digital-forensics-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Digital Forensics Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Digital Forensics Analyst" subtitle="Digital forensics workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Digital Forensics Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Cases", value: "5", delta: "-1", up: true },
    { label: "Evidence Collected", value: "234", delta: "+45", up: true },
    { label: "Cases Solved", value: "18", delta: "+3", up: true },
    { label: "Chain of Custody", value: "100%", delta: "—", up: true },
  ];

  const columns = [
    { key: "case", label: "Forensic Case" },
    { key: "type", label: "Type" },
    { key: "evidence", label: "Evidence Items" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { case: "FOR-001234", type: "Data Breach", evidence: "45", status: "Investigating" },
    { case: "FOR-001235", type: "Unauthorized Access", evidence: "23", status: "Review" },
    { case: "FOR-001236", type: "Insider Threat", evidence: "67", status: "Investigating" },
    { case: "FOR-001237", type: "Malware Analysis", evidence: "34", status: "Complete" },
    { case: "FOR-001238", type: "Fraud", evidence: "65", status: "Investigating" },
  ];

  return (
    <AppShell>
      <ModulePage title="Digital Forensics Analyst" subtitle="Digital forensics workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
