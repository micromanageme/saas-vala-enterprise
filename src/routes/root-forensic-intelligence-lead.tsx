import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-forensic-intelligence-lead")({
  head: () => ({ meta: [{ title: "Root Forensic Intelligence Lead — SaaS Vala" }, { name: "description", content: "Root forensic intelligence workspace" }] }),
  component: Page,
});

function Page() {
  const { data: forensicData, isLoading, error } = useQuery({
    queryKey: ["root-forensic-intelligence-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Root Forensic Intelligence Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Forensic Intelligence Lead" subtitle="Root forensic intelligence workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Forensic Intelligence Lead data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Investigations", value: "25", delta: "+3", up: true },
    { label: "Evidence Collected", value: "5.2TB", delta: "+500GB", up: true },
    { label: "Cases Solved", value: "20", delta: "+2", up: true },
    { label: "Intelligence Score", value: "92%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "case", label: "Forensic Case" },
    { key: "type", label: "Type" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { case: "FOR-001", type: "Security", severity: "Critical", status: "Active" },
    { case: "FOR-002", type: "Performance", severity: "High", status: "Active" },
    { case: "FOR-003", type: "Data", severity: "Medium", status: "Resolved" },
    { case: "FOR-004", type: "Compliance", severity: "High", status: "In Progress" },
    { case: "FOR-005", type: "Security", severity: "Critical", status: "Resolved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Forensic Intelligence Lead" subtitle="Root forensic intelligence workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
