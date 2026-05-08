import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/social-work-manager")({
  head: () => ({ meta: [{ title: "Social Work Manager — SaaS Vala" }, { name: "description", content: "Social work management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: socialWorkData, isLoading, error } = useQuery({
    queryKey: ["social-work-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Social Work Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Social Work Manager" subtitle="Social work management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Social Work Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Cases Open", value: "125", delta: "+15", up: true },
    { label: "Cases Resolved", value: "95", delta: "+10", up: true },
    { label: "Resolution Rate", value: "76%", delta: "+3%", up: true },
    { label: "Client Satisfaction", value: "4.5/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "case", label: "Social Case" },
    { key: "type", label: "Type" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { case: "CASE-001", type: "Family Support", priority: "High", status: "In Progress" },
    { case: "CASE-002", type: "Child Welfare", priority: "Critical", status: "Active" },
    { case: "CASE-003", type: "Elderly Care", priority: "Medium", status: "In Progress" },
    { case: "CASE-004", type: "Mental Health", priority: "High", status: "Active" },
    { case: "CASE-005", type: "Disability Support", priority: "Medium", status: "Resolved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Social Work Manager" subtitle="Social work management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
