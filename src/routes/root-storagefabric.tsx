import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-storagefabric")({
  head: () => ({ meta: [{ title: "Universal Storage Fabric — Universal Access Admin" }, { name: "description", content: "Object storage federation, replication, durability validation" }] }),
  component: Page,
});

function Page() {
  const { data: storageData, isLoading, error } = useQuery({
    queryKey: ["root-storagefabric"],
    queryFn: async () => {
      const response = await fetch("/api/root/storage-fabric?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch storage fabric data");
      return response.json();
    },
    refetchInterval: 20000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Storage Fabric" subtitle="Object storage federation, replication, durability validation" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Storage Fabric data</div>
      </AppShell>
    );
  }

  const data = storageData?.data;
  const storage = data?.objectStorage || [];
  const durability = data?.durabilityValidation;

  const kpis = durability ? [
    { label: "Durability", value: durability.overallDurability, delta: "—", up: true },
    { label: "Data Loss Events", value: durability.dataLossEvents.toString(), delta: "—", up: durability.dataLossEvents === 0 },
    { label: "Total Storage", value: storage.reduce((sum: number, s: any) => sum + parseFloat(s.size), 0).toFixed(1) + "TB", delta: "—", up: true },
  ];

  const columns = [
    { key: "name", label: "Storage" },
    { key: "type", label: "Type" },
    { key: "size", label: "Size" },
    { key: "used", label: "Used" },
    { key: "replication", label: "Replication" },
  ];

  const rows = storage.map((s: any) => ({
    name: s.name,
    type: s.type,
    size: s.size,
    used: s.used,
    replication: s.replication,
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Storage Fabric" subtitle="Object storage federation, replication, durability validation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
