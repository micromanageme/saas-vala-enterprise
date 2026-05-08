import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-businessrules")({
  head: () => ({ meta: [{ title: "Universal Business Rule Fabric — Universal Access Admin" }, { name: "description", content: "Centralized business logic, runtime rule execution, dynamic injection" }] }),
  component: Page,
});

function Page() {
  const { data: ruleData, isLoading, error } = useQuery({
    queryKey: ["root-businessrules"],
    queryFn: async () => {
      const response = await fetch("/api/root/business-rule-fabric?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch business rule fabric data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Business Rule Fabric" subtitle="Centralized business logic, runtime rule execution, dynamic injection" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Business Rule Fabric data</div>
      </AppShell>
    );
  }

  const data = ruleData?.data;
  const rules = data?.businessRules || [];
  const runtime = data?.runtimeExecution;

  const kpis = [
    { label: "Total Rules", value: runtime?.totalRules.toString() || "0", delta: "—", up: true },
    { label: "Active Rules", value: runtime?.activeRules.toString() || "0", delta: "—", up: true },
    { label: "Executions/s", value: runtime?.executionsPerSecond.toString() || "0", delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "Rule" },
    { key: "status", label: "Status" },
    { key: "executions", label: "Executions" },
    { key: "conflicts", label: "Conflicts" },
  ];

  const rows = rules.map((r: any) => ({
    name: r.name,
    status: r.status,
    executions: r.executions.toLocaleString(),
    conflicts: r.conflicts.toString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Business Rule Fabric" subtitle="Centralized business logic, runtime rule execution, dynamic injection" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
