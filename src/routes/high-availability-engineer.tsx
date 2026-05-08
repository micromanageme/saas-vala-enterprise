import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/high-availability-engineer")({
  head: () => ({ meta: [{ title: "High Availability Engineer — SaaS Vala" }, { name: "description", content: "High availability engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: haData, isLoading, error } = useQuery({
    queryKey: ["high-availability-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch High Availability Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="High Availability Engineer" subtitle="High availability engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load High Availability Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "System Uptime", value: "99.99%", delta: "+0.01%", up: true },
    { label: "HA Clusters", value: "8", delta: "+1", up: true },
    { label: "Failover Time", value: "5s", delta: "-1s", up: true },
    { label: "Redundancy Level", value: "N+2", delta: "—", up: true },
  ];

  const columns = [
    { key: "cluster", label: "HA Cluster" },
    { key: "nodes", label: "Nodes" },
    { key: "uptime", label: "Uptime" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { cluster: "API Cluster", nodes: "6", uptime: "99.99%", status: "Healthy" },
    { cluster: "Database Cluster", nodes: "5", uptime: "99.98%", status: "Healthy" },
    { cluster: "Cache Cluster", nodes: "4", uptime: "99.99%", status: "Healthy" },
    { cluster: "Queue Cluster", nodes: "3", uptime: "99.97%", status: "Healthy" },
    { cluster: "Storage Cluster", nodes: "4", uptime: "99.99%", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="High Availability Engineer" subtitle="High availability engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
