import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/edge-node-operator")({
  head: () => ({ meta: [{ title: "Edge Node Operator — SaaS Vala" }, { name: "description", content: "Edge node operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: edgeData, isLoading, error } = useQuery({
    queryKey: ["edge-node-operator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Edge Node Operator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Edge Node Operator" subtitle="Edge node operations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Edge Node Operator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Edge Nodes", value: "50", delta: "+5", up: true },
    { label: "Compute Capacity", value: "85%", delta: "+3%", up: true },
    { label: "Latency", value: "20ms", delta: "-5ms", up: true },
    { label: "Uptime", value: "99.5%", delta: "+0.2%", up: true },
  ];

  const columns = [
    { key: "node", label: "Edge Node" },
    { key: "location", label: "Location" },
    { key: "load", label: "Load" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { node: "EDGE-001", location: "Region A", load: "60%", status: "Active" },
    { node: "EDGE-002", location: "Region B", load: "75%", status: "Active" },
    { node: "EDGE-003", location: "Region C", load: "45%", status: "Active" },
    { node: "EDGE-004", location: "Region D", load: "80%", status: "Degraded" },
    { node: "EDGE-005", location: "Region E", load: "50%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Edge Node Operator" subtitle="Edge node operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
