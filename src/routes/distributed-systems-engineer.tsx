import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/distributed-systems-engineer")({
  head: () => ({ meta: [{ title: "Distributed Systems Engineer — SaaS Vala" }, { name: "description", content: "Distributed systems engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: distributedData, isLoading, error } = useQuery({
    queryKey: ["distributed-systems-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Distributed Systems Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Distributed Systems Engineer" subtitle="Distributed systems engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Distributed Systems Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Services Running", value: "150", delta: "+15", up: true },
    { label: "Consensus Health", value: "98%", delta: "+1%", up: true },
    { label: "Replication Lag", value: "50ms", delta: "-10ms", up: true },
    { label: "Throughput", value: "10K req/s", delta: "+1K", up: true },
  ];

  const columns = [
    { key: "service", label: "Distributed Service" },
    { key: "nodes", label: "Nodes" },
    { key: "replicas", label: "Replicas" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { service: "SVC-001", nodes: "5", replicas: "25", status: "Healthy" },
    { service: "SVC-002", nodes: "4", replicas: "20", status: "Healthy" },
    { service: "SVC-003", nodes: "6", replicas: "30", status: "Degraded" },
    { service: "SVC-004", nodes: "3", replicas: "15", status: "Healthy" },
    { service: "SVC-005", nodes: "5", replicas: "25", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Distributed Systems Engineer" subtitle="Distributed systems engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
