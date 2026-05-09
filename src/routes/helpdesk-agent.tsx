import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/helpdesk-agent")({
  head: () => ({ meta: [{ title: "Helpdesk Agent — SaaS Vala" }, { name: "description", content: "Helpdesk agent workspace" }] }),
  component: Page,
});

function Page() {
  const { data: helpdeskData, isLoading, error } = useQuery({
    queryKey: ["helpdesk-agent-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Helpdesk Agent data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Helpdesk Agent" subtitle="Helpdesk agent workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Helpdesk Agent data</div>
      </AppShell>
    );
  }

  const data = helpdeskData?.data;
  const kpis = data?.kpis ? [
    { label: "Tickets Today", value: "12", delta: "+2", up: false },
    { label: "Resolved", value: "8", delta: "+1", up: true },
    { label: "Avg Response", value: "15min", delta: "-3min", up: true },
    { label: "CSAT Score", value: "4.5/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "ticket", label: "Ticket" },
    { key: "customer", label: "Customer" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { ticket: "TKT-001234", customer: "Acme Corp", priority: "High", status: "In Progress" },
    { ticket: "TKT-001235", customer: "TechStart", priority: "Critical", status: "In Progress" },
    { ticket: "TKT-001236", customer: "Global Ltd", priority: "Medium", status: "Pending" },
    { ticket: "TKT-001237", customer: "Innovate Co", priority: "Low", status: "Resolved" },
    { ticket: "TKT-001238", customer: "Future Systems", priority: "High", status: "Assigned" },
  ];

  return (
    <AppShell>
      <ModulePage title="Helpdesk Agent" subtitle="Helpdesk agent workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
