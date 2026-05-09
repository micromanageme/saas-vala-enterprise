import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/support-manager")({
  head: () => ({ meta: [{ title: "Support Manager — SaaS Vala" }, { name: "description", content: "Support team management" }] }),
  component: Page,
});

function Page() {
  const { data: supportData, isLoading, error } = useQuery({
    queryKey: ["support-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Support Manager data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Support Manager" subtitle="Support team management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Support Manager data</div>
      </AppShell>
    );
  }

  const data = supportData?.data;
  const kpis = data?.kpis ? [
    { label: "Open Tickets", value: data.kpis.openTickets.toString(), delta: "-8", up: true },
    { label: "Avg Response", value: "2.5h", delta: "-0.5h", up: true },
    { label: "CSAT Score", value: "4.5/5", delta: "+0.3", up: true },
    { label: "Resolution Rate", value: "92%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "ticket", label: "Ticket" },
    { key: "customer", label: "Customer" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { ticket: "TKT-001234", customer: "Acme Corp", priority: "High", status: "In Progress" },
    { ticket: "TKT-001235", customer: "TechStart", priority: "Critical", status: "Escalated" },
    { ticket: "TKT-001236", customer: "Global Ltd", priority: "Medium", status: "In Progress" },
    { ticket: "TKT-001237", customer: "Innovate Co", priority: "Low", status: "Pending" },
    { ticket: "TKT-001238", customer: "Future Systems", priority: "High", status: "Assigned" },
  ];

  return (
    <AppShell>
      <ModulePage title="Support Manager" subtitle="Support team management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
