import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/onsite-support-engineer")({
  head: () => ({ meta: [{ title: "Onsite Support Engineer — SaaS Vala" }, { name: "description", content: "Onsite support engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: onsiteData, isLoading, error } = useQuery({
    queryKey: ["onsite-support-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Onsite Support Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Onsite Support Engineer" subtitle="Onsite support engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Onsite Support Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Support Tickets", value: "25", delta: "+3", up: true },
    { label: "Resolution Rate", value: "90%", delta: "+2%", up: true },
    { label: "Response Time", value: "15min", delta: "-5min", up: true },
    { label: "Client Satisfaction", value: "4.7/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "ticket", label: "Support Ticket" },
    { key: "client", label: "Client" },
    { key: "issue", label: "Issue Type" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { ticket: "SPT-001", client: "Client A", issue: "Hardware", status: "In Progress" },
    { ticket: "SPT-002", client: "Client B", issue: "Software", status: "In Progress" },
    { ticket: "SPT-003", client: "Client C", issue: "Network", status: "Resolved" },
    { ticket: "SPT-004", client: "Client D", issue: "Security", status: "Pending" },
    { ticket: "SPT-005", client: "Client E", issue: "Hardware", status: "Resolved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Onsite Support Engineer" subtitle="Onsite support engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
