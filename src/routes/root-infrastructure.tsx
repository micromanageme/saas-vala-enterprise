import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-infrastructure")({
  head: () => ({ meta: [{ title: "Infrastructure Core — Universal Access Admin" }, { name: "description", content: "Root-level infrastructure control" }] }),
  component: Page,
});

function Page() {
  const { data: infraData, isLoading, error } = useQuery({
    queryKey: ["root-infrastructure"],
    queryFn: async () => {
      const response = await fetch("/api/root/infrastructure?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch infrastructure data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Infrastructure Core" subtitle="Root-level infrastructure control" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Infrastructure Core data</div>
      </AppShell>
    );
  }

  const data = infraData?.data;
  const servers = data?.servers || [];

  const kpis = [
    { label: "Total Servers", value: servers.length.toString(), delta: "—", up: true },
    { label: "Active", value: servers.filter((s: any) => s.status === 'ACTIVE').length.toString(), delta: "—", up: true },
    { label: "Containers", value: data?.containers?.length.toString() || "0", delta: "—", up: true },
    { label: "Queues", value: data?.queues?.length.toString() || "0", delta: "—", up: true },
  ];

  const columns = [
    { key: "name", label: "Server" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "cpu", label: "CPU" },
    { key: "memory", label: "Memory" },
    { key: "region", label: "Region" },
    { key: "uptime", label: "Uptime" },
  ];

  const rows = servers.map((s: any) => ({
    name: s.name,
    type: s.type,
    status: s.status,
    cpu: `${s.cpu}%`,
    memory: `${s.memory}%`,
    region: s.region,
    uptime: s.uptime,
  }));

  return (
    <AppShell>
      <ModulePage title="Infrastructure Core" subtitle="Root-level infrastructure control" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
