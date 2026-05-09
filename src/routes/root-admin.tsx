import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-admin")({
  head: () => ({ meta: [{ title: "Root Admin — SaaS Vala" }, { name: "description", content: "Root-level system administration" }] }),
  component: Page,
});

function Page() {
  const { data: rootAdminData, isLoading, error } = useQuery({
    queryKey: ["root-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/root/dashboard?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch Root Admin data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Admin" subtitle="Root-level system administration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Admin data</div>
      </AppShell>
    );
  }

  const data = rootAdminData?.data;
  const universalControl = data?.universalControl;

  const kpis = universalControl ? [
    { label: "System Users", value: universalControl.totalSystemUsers.toLocaleString(), delta: "—", up: true },
    { label: "Tenants", value: universalControl.totalTenants.toLocaleString(), delta: "—", up: true },
    { label: "Branches", value: universalControl.totalBranches.toLocaleString(), delta: "—", up: true },
    { label: "System Health", value: universalControl.systemHealth, delta: "—", up: universalControl.systemHealth === 'HEALTHY' },
  ];

  const columns = [
    { key: "name", label: "Component" },
    { key: "route", label: "Route" },
    { key: "status", label: "Status" },
  ];

  const dashboards = data?.systemMap?.dashboards || [];
  const rows = dashboards.map((d: any) => ({
    name: d.name,
    route: d.route,
    status: d.status,
  }));

  return (
    <AppShell>
      <ModulePage title="Root Admin" subtitle="Root-level system administration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
