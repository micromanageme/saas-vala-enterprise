import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-configgraph")({
  head: () => ({ meta: [{ title: "Root Configuration Graph — Universal Access Admin" }, { name: "description", content: "Config dependency mapping, validation, drift detection" }] }),
  component: Page,
});

function Page() {
  const { data: configData, isLoading, error } = useQuery({
    queryKey: ["root-configgraph"],
    queryFn: async () => {
      const response = await fetch("/api/root/config-graph?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch config graph data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Configuration Graph" subtitle="Config dependency mapping, validation, drift detection" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Configuration Graph data</div>
      </AppShell>
    );
  }

  const data = configData?.data;
  const configs = data?.configDependencies || [];
  const drift = data?.driftDetection;

  const kpis = drift ? [
    { label: "Total Configs", value: drift.totalConfigs.toString(), delta: "—", up: true },
    { label: "Validated", value: drift.validatedConfigs.toString(), delta: "—", up: true },
    { label: "Drifted", value: drift.driftedConfigs.toString(), delta: "—", up: drift.driftedConfigs === 0 },
  ] : [];

  const columns = [
    { key: "name", label: "Config" },
    { key: "dependsOn", label: "Dependencies" },
    { key: "status", label: "Status" },
  ];

  const rows = configs.map((c: any) => ({
    name: c.name,
    dependsOn: c.dependsOn.join(", "),
    status: c.status,
  }));

  return (
    <AppShell>
      <ModulePage title="Root Configuration Graph" subtitle="Config dependency mapping, validation, drift detection" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
