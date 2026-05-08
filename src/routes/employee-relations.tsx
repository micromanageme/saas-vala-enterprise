import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/employee-relations")({
  head: () => ({ meta: [{ title: "Employee Relations — SaaS Vala" }, { name: "description", content: "Employee relations management" }] }),
  component: Page,
});

function Page() {
  const { data: erData, isLoading, error } = useQuery({
    queryKey: ["employee-relations-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Employee Relations data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Employee Relations" subtitle="Employee relations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Employee Relations data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Open Cases", value: "5", delta: "-2", up: true },
    { label: "Resolution Rate", value: "92%", delta: "+3%", up: true },
    { label: "Employee NPS", value: "72", delta: "+5", up: true },
    { label: "Retention Rate", value: "94%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "case", label: "Case" },
    { key: "type", label: "Type" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { case: "ER-001234", type: "Grievance", priority: "High", status: "In Progress" },
    { case: "ER-001235", type: "Conflict", priority: "Medium", status: "Resolved" },
    { case: "ER-001236", type: "Policy Question", priority: "Low", status: "In Progress" },
    { case: "ER-001237", type: "Harassment", priority: "Critical", status: "Investigation" },
    { case: "ER-001238", type: "Accommodation", priority: "Medium", status: "Resolved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Employee Relations" subtitle="Employee relations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
