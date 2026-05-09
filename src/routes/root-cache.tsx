import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-cache")({
  head: () => ({ meta: [{ title: "Universal Cache Command — Universal Access Admin" }, { name: "description", content: "Redis/cache clusters, invalidation, and synchronization" }] }),
  component: Page,
});

function Page() {
  const { data: cacheData, isLoading, error } = useQuery({
    queryKey: ["root-cache"],
    queryFn: async () => {
      const response = await fetch("/api/root/cache?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch cache data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Cache Command" subtitle="Redis/cache clusters, invalidation, and synchronization" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Cache Command data</div>
      </AppShell>
    );
  }

  const data = cacheData?.data;
  const clusters = data?.cacheClusters || [];
  const sync = data?.synchronization;

  const kpis = sync ? [
    { label: "Sync Status", value: sync.status, delta: "—", up: sync.status === 'SYNCED' },
    { label: "Pending Syncs", value: sync.pendingSyncs.toString(), delta: "—", up: sync.pendingSyncs === 0 },
    { label: "Failed Syncs", value: sync.failedSyncs.toString(), delta: "—", up: sync.failedSyncs === 0 },
  ];

  const columns = [
    { key: "name", label: "Cluster" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "memory", label: "Memory" },
    { key: "used", label: "Used" },
    { key: "hitRate", label: "Hit Rate" },
  ];

  const rows = clusters.map((c: any) => ({
    name: c.name,
    type: c.type,
    status: c.status,
    memory: c.memory,
    used: c.used,
    hitRate: `${c.hitRate}%`,
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Cache Command" subtitle="Redis/cache clusters, invalidation, and synchronization" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
