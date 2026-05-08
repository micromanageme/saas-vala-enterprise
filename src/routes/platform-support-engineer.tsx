import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/platform-support-engineer")({
  head: () => ({ meta: [{ title: "Platform Support Engineer — SaaS Vala" }, { name: "description", content: "Platform support engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: supportData, isLoading, error } = useQuery({
    queryKey: ["platform-support-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Platform Support Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Platform Support Engineer" subtitle="Platform support engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Platform Support Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tickets Resolved", value: "125", delta: "+15", up: true },
    { label: "Response Time", value: "15min", delta: "-3min", up: true },
    { label: "Satisfaction", value: "4.6/5", delta: "+0.1", up: true },
    { label: "Escalations", value: "5", delta: "-2", up: true },
  ];

  const columns = [
    { key: "ticket", label: "Support Ticket" },
    { key: "priority", label: "Priority" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { ticket: "TCK-001", priority: "High", category: "System", status: "In Progress" },
    { ticket: "TCK-002", priority: "Medium", category: "User", status: "Resolved" },
    { ticket: "TCK-003", priority: "Low", category: "Feature", status: "Queue" },
    { ticket: "TCK-004", priority: "Critical", category: "System", status: "In Progress" },
    { ticket: "TCK-005", priority: "Medium", category: "User", status: "Resolved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Platform Support Engineer" subtitle="Platform support engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
