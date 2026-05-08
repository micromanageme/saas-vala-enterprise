import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/technical-support")({
  head: () => ({ meta: [{ title: "Technical Support — SaaS Vala" }, { name: "description", content: "Technical support workspace" }] }),
  component: Page,
});

function Page() {
  const { data: techSupportData, isLoading, error } = useQuery({
    queryKey: ["technical-support-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Technical Support data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Technical Support" subtitle="Technical support workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Technical Support data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tickets Today", value: "8", delta: "+1", up: false },
    { label: "Resolved", value: "6", delta: "+2", up: true },
    { label: "Avg Resolution", value: "2.5h", delta: "-0.5h", up: true },
    { label: "Escalation Rate", value: "12%", delta: "-3%", up: true },
  ];

  const columns = [
    { key: "ticket", label: "Ticket" },
    { key: "issue", label: "Issue" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { ticket: "TKT-001234", issue: "Login Issue", severity: "Medium", status: "In Progress" },
    { ticket: "TKT-001235", issue: "API Error", severity: "High", status: "Escalated" },
    { ticket: "TKT-001236", issue: "Data Sync", severity: "Low", status: "Resolved" },
    { ticket: "TKT-001237", issue: "Performance", severity: "Medium", status: "In Progress" },
    { ticket: "TKT-001238", issue: "Integration", severity: "High", status: "Assigned" },
  ];

  return (
    <AppShell>
      <ModulePage title="Technical Support" subtitle="Technical support workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
