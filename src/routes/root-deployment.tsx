import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-deployment")({
  head: () => ({ meta: [{ title: "Deployment Control — Universal Access Admin" }, { name: "description", content: "Root-level CI/CD and environment management" }] }),
  component: Page,
});

function Page() {
  const { data: deploymentData, isLoading, error } = useQuery({
    queryKey: ["root-deployment"],
    queryFn: async () => {
      const response = await fetch("/api/root/deployment?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch deployment data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Deployment Control" subtitle="Root-level CI/CD and environment management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Deployment Control data</div>
      </AppShell>
    );
  }

  const data = deploymentData?.data;
  const deployments = data?.deployments || [];
  const featureFlags = data?.featureFlags || [];

  const kpis = [
    { label: "Total Deployments", value: deployments.length.toString(), delta: "—", up: true },
    { label: "Success Rate", value: `${deployments.filter((d: any) => d.status === 'SUCCESS').length / deployments.length * 100}%`, delta: "—", up: true },
    { label: "Feature Flags", value: featureFlags.length.toString(), delta: "—", up: true },
    { label: "Active Flags", value: featureFlags.filter((f: any) => f.enabled).length.toString(), delta: "—", up: true },
  ];

  const columns = [
    { key: "version", label: "Version" },
    { key: "environment", label: "Environment" },
    { key: "status", label: "Status" },
    { key: "duration", label: "Duration" },
    { key: "timestamp", label: "Timestamp" },
  ];

  const rows = deployments.map((d: any) => ({
    version: d.version,
    environment: d.environment,
    status: d.status,
    duration: `${d.duration}s`,
    timestamp: new Date(d.timestamp).toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Deployment Control" subtitle="Root-level CI/CD and environment management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
