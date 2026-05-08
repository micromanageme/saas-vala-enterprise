import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/trust-safety-analyst")({
  head: () => ({ meta: [{ title: "Trust & Safety Analyst — SaaS Vala" }, { name: "description", content: "Trust and safety analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: trustData, isLoading, error } = useQuery({
    queryKey: ["trust-safety-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Trust & Safety Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Trust & Safety Analyst" subtitle="Trust and safety analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Trust & Safety Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Violations Handled", value: "125", delta: "+15", up: true },
    { label: "Trust Score", value: "94", delta: "+2", up: true },
    { label: "Response Time", value: "2 hours", delta: "-30min", up: true },
    { label: "User Satisfaction", value: "96%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "case", label: "Safety Case" },
    { key: "type", label: "Type" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { case: "TST-001", type: "Harassment", severity: "High", status: "Resolved" },
    { case: "TST-002", type: "Spam", severity: "Low", status: "Resolved" },
    { case: "TST-003", type: "Fraud", severity: "Critical", status: "In Progress" },
    { case: "TST-004", type: "Harassment", severity: "Medium", status: "Resolved" },
    { case: "TST-005", type: "Spam", severity: "Low", status: "Resolved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Trust & Safety Analyst" subtitle="Trust and safety analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
