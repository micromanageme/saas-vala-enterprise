import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Super Admin Command Center — SaaS Vala" }, { name: "description", content: "Ultimate Enterprise Command Center" }] }),
  component: Page,
});

function Page() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Super Admin dashboard data");
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds for realtime feel
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Super Admin Command Center" subtitle="Ultimate Enterprise Command Center" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Super Admin dashboard data</div>
      </AppShell>
    );
  }

  const data = dashboardData?.data;
  const kpis = data?.kpis ? [
    { label: "Total Users", value: data.kpis.totalUsers.toLocaleString(), delta: `+${data.kpis.usersDelta}%`, up: data.kpis.usersDelta > 0 },
    { label: "Active Users", value: data.kpis.activeUsers.toLocaleString(), delta: `+${data.kpis.usersDelta}%`, up: data.kpis.usersDelta > 0 },
    { label: "Total Tenants", value: data.kpis.totalTenants.toLocaleString(), delta: `+${data.kpis.tenantsDelta}%`, up: data.kpis.tenantsDelta > 0 },
    { label: "Active Tenants", value: data.kpis.activeTenants.toLocaleString(), delta: `+${data.kpis.tenantsDelta}%`, up: data.kpis.tenantsDelta > 0 },
    { label: "Total Licenses", value: data.kpis.totalLicenses.toLocaleString(), delta: `+${data.kpis.licensesDelta}%`, up: data.kpis.licensesDelta > 0 },
    { label: "Active Licenses", value: data.kpis.activeLicenses.toLocaleString(), delta: `+${data.kpis.licensesDelta}%`, up: data.kpis.licensesDelta > 0 },
    { label: "Total Revenue", value: `$${(data.kpis.totalRevenue / 1000000).toFixed(2)}M`, delta: `+${data.kpis.revenueDelta}%`, up: data.kpis.revenueDelta > 0 },
    { label: "Monthly Revenue", value: `$${(data.kpis.monthlyRevenue / 1000).toFixed(0)}K`, delta: `+${data.kpis.revenueDelta}%`, up: data.kpis.revenueDelta > 0 },
    { label: "Open Tickets", value: data.kpis.openTickets.toString(), delta: `${data.kpis.ticketsDelta}`, up: data.kpis.ticketsDelta < 0 },
    { label: "Pending Approvals", value: data.kpis.pendingApprovals.toString(), delta: "—", up: true },
    { label: "Active Sessions", value: data.kpis.activeSessions.toLocaleString(), delta: "—", up: true },
    { label: "Total Transactions", value: data.kpis.totalTransactions.toLocaleString(), delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "displayName", label: "User" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "company", label: "Company" },
    { key: "roles", label: "Roles" },
    { key: "sessions", label: "Sessions" },
    { key: "transactions", label: "Transactions" },
  ];
  
  const rows = data?.topUsers?.map((u: any) => ({
    displayName: u.displayName,
    email: u.email,
    status: u.status,
    company: u.company || "—",
    roles: u.roles.join(", ") || "—",
    sessions: u.sessions.toString(),
    transactions: u.transactions.toString(),
  })) || [];

  // System Health Display
  const systemHealth = data?.systemHealth;
  const security = data?.security;

  return (
    <AppShell>
      <ModulePage 
        title="Super Admin Command Center" 
        subtitle="Ultimate Enterprise Command Center" 
        kpis={kpis} 
        columns={columns} 
        rows={rows}
      />
      {systemHealth && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">System Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Status:</span>
              <span className={`ml-2 ${systemHealth.status === 'HEALTHY' ? 'text-green-600' : 'text-red-600'}`}>
                {systemHealth.status}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Uptime:</span>
              <span className="ml-2">{systemHealth.uptime}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">API Latency:</span>
              <span className="ml-2">{systemHealth.apiLatency}ms</span>
            </div>
            <div>
              <span className="text-muted-foreground">DB Latency:</span>
              <span className="ml-2">{systemHealth.dbLatency}ms</span>
            </div>
          </div>
        </div>
      )}
      {security && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Security Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Status:</span>
              <span className={`ml-2 ${security.status === 'SECURE' ? 'text-green-600' : 'text-red-600'}`}>
                {security.status}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Failed Logins (24h):</span>
              <span className="ml-2">{security.failedLogins}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Suspicious Activity:</span>
              <span className="ml-2">{security.suspiciousActivity}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Active Threats:</span>
              <span className="ml-2">{security.activeThreats}</span>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
