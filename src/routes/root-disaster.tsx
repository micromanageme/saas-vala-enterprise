import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-disaster")({
  head: () => ({ meta: [{ title: "Disaster Recovery Center — Universal Access Admin" }, { name: "description", content: "Root-level backup, restore, and failover control" }] }),
  component: Page,
});

function Page() {
  const { data: disasterData, isLoading, error } = useQuery({
    queryKey: ["root-disaster"],
    queryFn: async () => {
      const response = await fetch("/api/root/disaster-recovery?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch disaster recovery data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Disaster Recovery Center" subtitle="Root-level backup, restore, and failover control" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Disaster Recovery Center data</div>
      </AppShell>
    );
  }

  const data = disasterData?.data;
  const restorePoints = data?.restorePoints || [];
  const failover = data?.failover;

  const kpis = [
    { label: "Restore Points", value: restorePoints.length.toString(), delta: "—", up: true },
    { label: "Failover Status", value: failover?.status || "—", delta: "—", up: failover?.status === 'STANDBY' },
    { label: "RTO", value: failover?.rto || "—", delta: "—", up: true },
    { label: "RPO", value: failover?.rpo || "—", delta: "—", up: true },
  ];

  const columns = [
    { key: "name", label: "Restore Point" },
    { key: "type", label: "Type" },
    { key: "size", label: "Size" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" },
  ];

  const rows = restorePoints.map((rp: any) => ({
    name: rp.name,
    type: rp.type,
    size: rp.size,
    status: rp.status,
    createdAt: new Date(rp.createdAt).toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Disaster Recovery Center" subtitle="Root-level backup, restore, and failover control" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
