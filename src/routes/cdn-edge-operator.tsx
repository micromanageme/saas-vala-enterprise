import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/cdn-edge-operator")({
  head: () => ({ meta: [{ title: "CDN Edge Operator — SaaS Vala" }, { name: "description", content: "CDN edge operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: cdnData, isLoading, error } = useQuery({
    queryKey: ["cdn-edge-operator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch CDN Edge Operator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="CDN Edge Operator" subtitle="CDN edge operations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load CDN Edge Operator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Edge Locations", value: "45", delta: "+5", up: true },
    { label: "Cache Hit Ratio", value: "95%", delta: "+2%", up: true },
    { label: "Bandwidth/Day", value: "12.5TB", delta: "+2TB", up: true },
    { label: "Avg Latency", value: "25ms", delta: "-5ms", up: true },
  ];

  const columns = [
    { key: "location", label: "Edge Location" },
    { key: "cacheHit", label: "Cache Hit" },
    { key: "bandwidth", label: "Bandwidth" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { location: "New York", cacheHit: "96%", bandwidth: "2.5TB", status: "Active" },
    { location: "London", cacheHit: "95%", bandwidth: "2.1TB", status: "Active" },
    { location: "Tokyo", cacheHit: "94%", bandwidth: "1.8TB", status: "Active" },
    { location: "Singapore", cacheHit: "95%", bandwidth: "1.5TB", status: "Active" },
    { location: "Sao Paulo", cacheHit: "93%", bandwidth: "1.2TB", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="CDN Edge Operator" subtitle="CDN edge operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
