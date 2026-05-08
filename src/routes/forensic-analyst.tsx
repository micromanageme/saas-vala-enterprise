import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/forensic-analyst")({
  head: () => ({ meta: [{ title: "Forensic Analyst — SaaS Vala" }, { name: "description", content: "Digital forensics and investigation" }] }),
  component: Page,
});

function Page() {
  const { data: forensicData, isLoading, error } = useQuery({
    queryKey: ["forensic-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Forensic Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Forensic Analyst" subtitle="Digital forensics and investigation" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Forensic Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Cases", value: "3", delta: "+1", up: false },
    { label: "Evidence Collected", value: "45GB", delta: "+12GB", up: true },
    { label: "Reports Generated", value: "8", delta: "+2", up: true },
    { label: "Cases Closed", value: "12", delta: "+3", up: true },
  ];

  const columns = [
    { key: "case", label: "Case" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
  ];

  const rows = [
    { case: "CASE-001234", type: "Data Breach", status: "Investigation", priority: "High" },
    { case: "CASE-001235", type: "Insider Threat", status: "Analysis", priority: "Critical" },
    { case: "CASE-001236", type: "Malware Incident", status: "Resolved", priority: "Medium" },
    { case: "CASE-001237", type: "Unauthorized Access", status: "Investigation", priority: "High" },
    { case: "CASE-001238", type: "Policy Violation", status: "Resolved", priority: "Low" },
  ];

  return (
    <AppShell>
      <ModulePage title="Forensic Analyst" subtitle="Digital forensics and investigation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
