import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/regular-admin")({
  head: () => ({ meta: [{ title: "Admin — SaaS Vala" }, { name: "description", content: "Standard administration dashboard" }] }),
  component: Page,
});

function Page() {
  const { data: adminData, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Admin" subtitle="Standard administration dashboard" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Admin data</div>
      </AppShell>
    );
  }

  const data = adminData?.data;
  const kpis = data?.kpis ? [
    { label: "Active Users", value: data.kpis.activeUsers.toLocaleString(), delta: `+${data.kpis.usersDelta}%`, up: data.kpis.usersDelta > 0 },
    { label: "Active Tenants", value: data.kpis.activeTenants.toLocaleString(), delta: `+${data.kpis.tenantsDelta}%`, up: data.kpis.tenantsDelta > 0 },
    { label: "Open Tickets", value: data.kpis.openTickets.toString(), delta: `${data.kpis.ticketsDelta}`, up: data.kpis.ticketsDelta < 0 },
    { label: "Pending Approvals", value: data.kpis.pendingApprovals.toString(), delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "displayName", label: "User" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "roles", label: "Roles" },
  ];

  const rows = data?.topUsers?.slice(0, 10).map((u: any) => ({
    displayName: u.displayName,
    email: u.email,
    status: u.status,
    roles: u.roles.join(", ") || "—",
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Admin" subtitle="Standard administration dashboard" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
