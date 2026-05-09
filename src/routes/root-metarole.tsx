import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-metarole")({
  head: () => ({ meta: [{ title: "Universal Meta-Role Engine — Universal Access Admin" }, { name: "description", content: "Dynamic runtime role generation, hierarchical inheritance, temporary elevation" }] }),
  component: Page,
});

function Page() {
  const { data: roleData, isLoading, error } = useQuery({
    queryKey: ["root-metarole"],
    queryFn: async () => {
      const response = await fetch("/api/root/meta-role-engine?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch meta-role engine data");
      return response.json();
    },
    refetchInterval: 20000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Meta-Role Engine" subtitle="Dynamic runtime role generation, hierarchical inheritance, temporary elevation" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Meta-Role Engine data</div>
      </AppShell>
    );
  }

  const data = roleData?.data;
  const roles = data?.runtimeRoles || [];
  const inheritance = data?.hierarchicalInheritance;

  const kpis = inheritance ? [
    { label: "Total Roles", value: inheritance.totalRoles.toString(), delta: "—", up: true },
    { label: "Active Hierarchies", value: inheritance.activeHierarchies.toString(), delta: "—", up: true },
    { label: "Active Elevations", value: data?.privilegeElevation?.activeElevations.toString() || "0", delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "Role" },
    { key: "type", label: "Type" },
    { key: "permissions", label: "Permissions" },
    { key: "context", label: "Context" },
  ];

  const rows = roles.map((r: any) => ({
    name: r.name,
    type: r.type,
    permissions: r.permissions.join(", "),
    context: r.context || "—",
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Meta-Role Engine" subtitle="Dynamic runtime role generation, hierarchical inheritance, temporary elevation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
