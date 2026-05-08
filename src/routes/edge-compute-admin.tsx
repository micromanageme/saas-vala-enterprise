import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/edge-compute-admin")({
  head: () => ({ meta: [{ title: "Edge Compute Admin — SaaS Vala" }, { name: "description", content: "Edge compute administration" }] }),
  component: Page,
});

function Page() {
  const { data: edgeData, isLoading, error } = useQuery({
    queryKey: ["edge-compute-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Edge Compute Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Edge Compute Admin" subtitle="Edge compute administration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Edge Compute Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Edge Nodes", value: "45", delta: "+5", up: true },
    { label: "Coverage Regions", value: "12", delta: "+2", up: true },
    { label: "Latency Reduction", value: "65%", delta: "+5%", up: true },
    { label: "Node Health", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "region", label: "Region" },
    { key: "nodes", label: "Nodes" },
    { key: "workload", label: "Workload" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { region: "North America", nodes: "12", workload: "CDN + Compute", status: "Active" },
    { region: "Europe", nodes: "10", workload: "CDN + Compute", status: "Active" },
    { region: "Asia Pacific", nodes: "8", workload: "CDN + Compute", status: "Active" },
    { region: "South America", nodes: "6", workload: "CDN", status: "Active" },
    { region: "Africa", nodes: "4", workload: "CDN", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Edge Compute Admin" subtitle="Edge compute administration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
