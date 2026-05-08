import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin-tenants")({
  head: () => ({ meta: [{ title: "Tenant Management — Super Admin" }, { name: "description", content: "Global tenant management" }] }),
  component: Page,
});

function Page() {
  const { data: tenantsData, isLoading, error } = useQuery({
    queryKey: ["admin-tenants"],
    queryFn: async () => {
      const response = await fetch("/api/admin/tenants");
      if (!response.ok) throw new Error("Failed to fetch tenants");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Tenant Management" subtitle="Global tenant management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load tenants</div>
      </AppShell>
    );
  }

  const tenants = tenantsData?.tenants || [];

  const kpis = [
    { label: "Total Tenants", value: tenants.length.toString(), delta: "+5", up: true },
    { label: "Active", value: tenants.filter((t: any) => t.status === 'ACTIVE').length.toString(), delta: "+3", up: true },
    { label: "Total Users", value: tenants.reduce((sum: number, t: any) => sum + (t._count?.users || 0), 0).toString(), delta: "+12", up: true },
    { label: "Total Workspaces", value: tenants.reduce((sum: number, t: any) => sum + (t._count?.workspaces || 0), 0).toString(), delta: "+8", up: true },
  ];

  const columns = [
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug" },
    { key: "domain", label: "Domain" },
    { key: "status", label: "Status" },
    { key: "users", label: "Users" },
    { key: "workspaces", label: "Workspaces" },
  ];

  const rows = tenants.map((t: any) => ({
    name: t.name,
    slug: t.slug,
    domain: t.domain || "—",
    status: t.status,
    users: t._count?.users?.toString() || "0",
    workspaces: t._count?.workspaces?.toString() || "0",
  }));

  return (
    <AppShell>
      <ModulePage title="Tenant Management" subtitle="Global tenant management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
