import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/detective-operations")({
  head: () => ({ meta: [{ title: "Detective Operations — SaaS Vala" }, { name: "description", content: "Detective operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: detectiveData, isLoading, error } = useQuery({
    queryKey: ["detective-operations-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Detective Operations data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Detective Operations" subtitle="Detective operations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Detective Operations data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Cases Active", value: "35", delta: "+5", up: true },
    { label: "Solved", value: "120", delta: "+15", up: true },
    { label: "Clearance Rate", value: "78%", delta: "+3%", up: true },
    { label: "Avg Investigation", value: "14 days", delta: "-2 days", up: true },
  ];

  const columns = [
    { key: "case", label: "Case Number" },
    { key: "type", label: "Type" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { case: "DET-001", type: "Homicide", priority: "High", status: "Active" },
    { case: "DET-002", type: "Fraud", priority: "Medium", status: "Active" },
    { case: "DET-003", type: "Theft", priority: "Low", status: "Closed" },
    { case: "DET-004", type: "Assault", priority: "High", status: "Active" },
    { case: "DET-005", type: "Robbery", priority: "Medium", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="Detective Operations" subtitle="Detective operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
