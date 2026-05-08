import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/universal-memory-fabric-admin")({
  head: () => ({ meta: [{ title: "Universal Memory Fabric Admin — SaaS Vala" }, { name: "description", content: "Universal memory fabric administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: memoryData, isLoading, error } = useQuery({
    queryKey: ["universal-memory-fabric-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Universal Memory Fabric Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Memory Fabric Admin" subtitle="Universal memory fabric administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Memory Fabric Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Memory Nodes", value: "50", delta: "+5", up: true },
    { label: "Capacity", value: "500TB", delta: "+50TB", up: true },
    { label: "Throughput", value: "100GB/s", delta: "+10GB/s", up: true },
    { label: "Availability", value: "99.9%", delta: "+0.1%", up: true },
  ];

  const columns = [
    { key: "node", label: "Memory Node" },
    { key: "type", label: "Type" },
    { key: "usage", label: "Usage" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { node: "MEM-001", type: "Hot", usage: "85%", status: "Active" },
    { node: "MEM-002", type: "Warm", usage: "60%", status: "Active" },
    { node: "MEM-003", type: "Cold", usage: "30%", status: "Active" },
    { node: "MEM-004", type: "Hot", usage: "90%", status: "Active" },
    { node: "MEM-005", type: "Warm", usage: "55%", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Memory Fabric Admin" subtitle="Universal memory fabric administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
