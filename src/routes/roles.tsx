import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/roles")({
  head: () => ({ meta: [{ title: "Roles & Permissions — SaaS Vala" }, { name: "description", content: "Permission matrix & role builder" }] }),
  component: Page,
});

function Page() {
  const { data: rolesData, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await fetch("/api/roles?type=all");
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      return response.json();
    },
  });

  const data = rolesData?.data;
  const roles = data?.roles || [];
  const totalPermissions = data?.kpis?.totalPermissions || 0;
  const totalUsers = data?.kpis?.totalUsers || 0;
  const systemRoles = data?.kpis?.systemRoles || 0;
  const customRoles = data?.kpis?.customRoles || 0;
  
  const kpis = [
    { label: "Roles", value: roles.length.toString(), delta: "—", up: true },
    { label: "Permissions", value: totalPermissions.toString(), delta: "—", up: true },
    { label: "Users", value: totalUsers.toString(), delta: "—", up: true },
    { label: "System Roles", value: systemRoles.toString(), delta: "—", up: true }
  ];
  
  const columns = [{ key: "name", label: "Role" }, { key: "level", label: "Level" }, { key: "users", label: "Users" }, { key: "permissions", label: "Permissions" }, { key: "status", label: "Status" }];
  const rows = roles.slice(0, 10).map((r: any) => ({
    "name": r.name,
    "level": r.level,
    "users": r._count?.users || 0,
    "permissions": r._count?.permissions || 0,
    "status": r.isSystem ? "System" : "Custom"
  }));

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Roles & Permissions" subtitle="Permission matrix & role builder" kpis={kpis} columns={columns} rows={[]} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ModulePage title="Roles & Permissions" subtitle="Permission matrix & role builder" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
