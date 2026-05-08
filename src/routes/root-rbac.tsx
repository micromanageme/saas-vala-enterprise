import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-rbac")({
  head: () => ({ meta: [{ title: "Root RBAC Engine — Universal Access Admin" }, { name: "description", content: "Universal permission control at root level" }] }),
  component: Page,
});

function Page() {
  const { data: rbacData, isLoading, error } = useQuery({
    queryKey: ["root-rbac"],
    queryFn: async () => {
      const response = await fetch("/api/root/rbac?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch root RBAC data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root RBAC Engine" subtitle="Universal permission control at root level" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root RBAC Engine data</div>
      </AppShell>
    );
  }

  const data = rbacData?.data;
  const roleGraph = data?.roleGraph || [];

  const kpis = [
    { label: "Total Roles", value: roleGraph.length.toString(), delta: "—", up: true },
    { label: "System Roles", value: roleGraph.filter((r: any) => r.isSystem).length.toString(), delta: "—", up: true },
    { label: "Total Permissions", value: data?.permissions?.length.toString() || "0", delta: "—", up: true },
    { label: "Access Resources", value: data?.accessTree?.length.toString() || "0", delta: "—", up: true },
  ];

  const columns = [
    { key: "name", label: "Role" },
    { key: "level", label: "Level" },
    { key: "isSystem", label: "System" },
    { key: "userCount", label: "Users" },
    { key: "permissionCount", label: "Permissions" },
  ];

  const rows = roleGraph.map((r: any) => ({
    name: r.name,
    level: r.level.toString(),
    isSystem: r.isSystem ? "Yes" : "No",
    userCount: r.userCount.toString(),
    permissionCount: r.permissionCount.toString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Root RBAC Engine" subtitle="Universal permission control at root level" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
