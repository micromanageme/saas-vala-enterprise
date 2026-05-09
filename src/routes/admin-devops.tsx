import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin-devops")({
  head: () => ({ meta: [{ title: "Server & DevOps — Super Admin" }, { name: "description", content: "Server, deployment and infrastructure management" }] }),
  component: Page,
});

function Page() {
  const { data: devopsData, isLoading, error } = useQuery({
    queryKey: ["admin-devops"],
    queryFn: async () => {
      const response = await fetch("/api/admin/devops?type=all");
      if (!response.ok) throw new Error("Failed to fetch DevOps data");
      return response.json();
    },
    refetchInterval: 10000, // Refresh every 10 seconds for realtime server monitoring
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Server & DevOps" subtitle="Server, deployment and infrastructure management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load DevOps data</div>
      </AppShell>
    );
  }

  const data = devopsData?.data;
  const kpis = data?.kpis ? [
    { label: "Total Servers", value: data.kpis.totalServers.toString(), delta: `+${data.kpis.serversDelta}`, up: data.kpis.serversDelta > 0 },
    { label: "Active", value: data.kpis.activeServers.toString(), delta: `+${data.kpis.serversDelta}`, up: data.kpis.serversDelta > 0 },
    { label: "Containers", value: data.kpis.activeContainers.toString(), delta: `+${data.kpis.containersDelta}`, up: data.kpis.containersDelta > 0 },
    { label: "Deployments", value: data.kpis.totalDeployments.toString(), delta: `+${data.kpis.deploymentsDelta}`, up: data.kpis.deploymentsDelta > 0 },
  ];

  const columns = [
    { key: "name", label: "Server" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "cpu", label: "CPU" },
    { key: "memory", label: "Memory" },
    { key: "region", label: "Region" },
  ];

  const rows = data?.servers?.map((s: any) => ({
    name: s.name,
    type: s.type,
    status: s.status,
    cpu: `${s.cpu}%`,
    memory: `${s.memory}%`,
    region: s.region,
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Server & DevOps" subtitle="Server, deployment and infrastructure management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
