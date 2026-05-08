import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-tenants")({
  head: () => ({ meta: [{ title: "Global Tenant Control — Universal Access Admin" }, { name: "description", content: "Root-level tenant management" }] }),
  component: Page,
});

function Page() {
  const { data: tenantsData, isLoading, error } = useQuery({
    queryKey: ["root-tenants"],
    queryFn: async () => {
      const response = await fetch("/api/admin/tenants", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch tenant data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Global Tenant Control" subtitle="Root-level tenant management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Global Tenant Control data</div>
      </AppShell>
    );
  }

  const tenants = tenantsData?.tenants || [];

  const kpis = [
    { label: "Total Tenants", value: tenants.length.toString(), delta: "—", up: true },
    { label: "Active", value: tenants.filter((t: any) => t.status === 'ACTIVE').length.toString(), delta: "—", up: true },
    { label: "Total Users", value: tenants.reduce((sum: number, t: any) => sum + (t._count?.users || 0), 0).toString(), delta: "—", up: true },
    { label: "Total Workspaces", value: tenants.reduce((sum: number, t: any) => sum + (t._count?.workspaces || 0), 0).toString(), delta: "—", up: true },
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
      <ModulePage title="Global Tenant Control" subtitle="Root-level tenant management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
