import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/investigation-officer")({
  head: () => ({ meta: [{ title: "Investigation Officer — SaaS Vala" }, { name: "description", content: "Investigation officer workspace" }] }),
  component: Page,
});

function Page() {
  const { data: investigationData, isLoading, error } = useQuery({
    queryKey: ["investigation-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Investigation Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Investigation Officer" subtitle="Investigation officer workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Investigation Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Investigations", value: "8", delta: "+1", up: true },
    { label: "Evidence Collected", value: "245", delta: "+35", up: true },
    { label: "Cases Closed", value: "12", delta: "+2", up: true },
    { label: "Avg Investigation Time", value: "18 days", delta: "-3 days", up: true },
  ];

  const columns = [
    { key: "case", label: "Investigation Case" },
    { key: "type", label: "Type" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { case: "INV-2024-001", type: "Fraud", priority: "High", status: "Active" },
    { case: "INV-2024-002", type: "Theft", priority: "Critical", status: "In Progress" },
    { case: "INV-2024-003", type: "Compliance", priority: "Medium", status: "Review" },
    { case: "INV-2024-004", type: "Internal", priority: "High", status: "Active" },
    { case: "INV-2024-005", type: "External", priority: "Low", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="Investigation Officer" subtitle="Investigation officer workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
