import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/master-admin")({
  head: () => ({ meta: [{ title: "Master Admin — SaaS Vala" }, { name: "description", content: "Master-level administration across all entities" }] }),
  component: Page,
});

function Page() {
  const { data: masterData, isLoading, error } = useQuery({
    queryKey: ["master-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Master Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Master Admin" subtitle="Master-level administration across all entities" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Master Admin data</div>
      </AppShell>
    );
  }

  const data = masterData?.data;
  const kpis = data?.kpis ? [
    { label: "Total Users", value: data.kpis.totalUsers.toLocaleString(), delta: `+${data.kpis.usersDelta}%`, up: data.kpis.usersDelta > 0 },
    { label: "Active Tenants", value: data.kpis.activeTenants.toLocaleString(), delta: `+${data.kpis.tenantsDelta}%`, up: data.kpis.tenantsDelta > 0 },
    { label: "Total Licenses", value: data.kpis.totalLicenses.toLocaleString(), delta: `+${data.kpis.licensesDelta}%`, up: data.kpis.licensesDelta > 0 },
    { label: "Active Sessions", value: data.kpis.activeSessions.toLocaleString(), delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "displayName", label: "User" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "company", label: "Company" },
  ];

  const rows = data?.topUsers?.slice(0, 10).map((u: any) => ({
    displayName: u.displayName,
    email: u.email,
    status: u.status,
    company: u.company || "—",
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Master Admin" subtitle="Master-level administration across all entities" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
