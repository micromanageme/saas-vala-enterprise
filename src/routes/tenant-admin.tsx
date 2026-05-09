import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/tenant-admin")({
  head: () => ({ meta: [{ title: "Tenant Admin — SaaS Vala" }, { name: "description", content: "Tenant-level administration" }] }),
  component: Page,
});

function Page() {
  const { data: tenantData, isLoading, error } = useQuery({
    queryKey: ["tenant-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Tenant Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Tenant Admin" subtitle="Tenant-level administration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Tenant Admin data</div>
      </AppShell>
    );
  }

  const data = tenantData?.data;
  const kpis = data?.kpis ? [
    { label: "Tenant Users", value: data.kpis.activeUsers.toLocaleString(), delta: `+${data.kpis.usersDelta}%`, up: data.kpis.usersDelta > 0 },
    { label: "Active Licenses", value: data.kpis.activeLicenses.toLocaleString(), delta: `+${data.kpis.licensesDelta}%`, up: data.kpis.licensesDelta > 0 },
    { label: "Monthly Revenue", value: `$${(data.kpis.monthlyRevenue / 1000).toFixed(0)}K`, delta: `+${data.kpis.revenueDelta}%`, up: data.kpis.revenueDelta > 0 },
    { label: "Open Tickets", value: data.kpis.openTickets.toString(), delta: `${data.kpis.ticketsDelta}`, up: data.kpis.ticketsDelta < 0 },
  ] : [];

  const columns = [
    { key: "user", label: "User" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "lastActive", label: "Last Active" },
  ];

  const rows = data?.topUsers?.slice(0, 10).map((u: any) => ({
    user: u.displayName,
    role: u.roles[0] || "—",
    status: u.status,
    lastActive: "2h ago",
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Tenant Admin" subtitle="Tenant-level administration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
