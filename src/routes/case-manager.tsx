import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/case-manager")({
  head: () => ({ meta: [{ title: "Case Manager — SaaS Vala" }, { name: "description", content: "Case management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: caseData, isLoading, error } = useQuery({
    queryKey: ["case-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Case Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Case Manager" subtitle="Case management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Case Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Open Cases", value: "32", delta: "+4", up: true },
    { label: "Closed This Month", value: "18", delta: "+5", up: true },
    { label: "Avg Resolution Time", value: "12 days", delta: "-2 days", up: true },
    { label: "Backlog", value: "5", delta: "-1", up: true },
  ];

  const columns = [
    { key: "caseNumber", label: "Case Number" },
    { key: "type", label: "Case Type" },
    { key: "assignedTo", label: "Assigned To" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { caseNumber: "CASE-2024-001", type: "Civil", assignedTo: "John Smith", status: "In Progress" },
    { caseNumber: "CASE-2024-002", type: "Criminal", assignedTo: "Sarah Johnson", status: "Review" },
    { caseNumber: "CASE-2024-003", type: "Family", assignedTo: "Mike Brown", status: "Active" },
    { caseNumber: "CASE-2024-004", type: "Corporate", assignedTo: "Emily Davis", status: "Pending" },
    { caseNumber: "CASE-2024-005", type: "Labor", assignedTo: "Alex Wilson", status: "Closed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Case Manager" subtitle="Case management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
