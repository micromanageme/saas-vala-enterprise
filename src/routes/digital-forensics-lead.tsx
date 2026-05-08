import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/digital-forensics-lead")({
  head: () => ({ meta: [{ title: "Digital Forensics Lead — SaaS Vala" }, { name: "description", content: "Digital forensics leadership workspace" }] }),
  component: Page,
});

function Page() {
  const { data: forensicsData, isLoading, error } = useQuery({
    queryKey: ["digital-forensics-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Digital Forensics Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Digital Forensics Lead" subtitle="Digital forensics leadership workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Digital Forensics Lead data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Cases Active", value: "25", delta: "+3", up: true },
    { label: "Evidence Collected", value: "10TB", delta: "+1TB", up: true },
    { label: "Solve Rate", value: "88%", delta: "+2%", up: true },
    { label: "Chain of Custody", value: "100%", delta: "0%", up: true },
  ];

  const columns = [
    { key: "case", label: "Forensic Case" },
    { key: "type", label: "Type" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { case: "FOR-001", type: "Cybercrime", severity: "High", status: "Active" },
    { case: "FOR-002", type: "Fraud", severity: "Medium", status: "Active" },
    { case: "FOR-003", type: "Data Breach", severity: "Critical", status: "In Progress" },
    { case: "FOR-004", type: "Cybercrime", severity: "High", status: "Resolved" },
    { case: "FOR-005", type: "Fraud", severity: "Medium", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Digital Forensics Lead" subtitle="Digital forensics leadership workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
