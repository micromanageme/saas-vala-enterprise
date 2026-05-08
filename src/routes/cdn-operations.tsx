import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/cdn-operations")({
  head: () => ({ meta: [{ title: "CDN Operations — SaaS Vala" }, { name: "description", content: "CDN operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: cdnOpsData, isLoading, error } = useQuery({
    queryKey: ["cdn-operations-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch CDN Operations data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="CDN Operations" subtitle="CDN operations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load CDN Operations data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Edge Locations", value: "50", delta: "+5", up: true },
    { label: "Cache Hit Ratio", value: "96%", delta: "+2%", up: true },
    { label: "Bandwidth/Day", value: "15TB", delta: "+2TB", up: true },
    { label: "Avg Latency", value: "20ms", delta: "-3ms", up: true },
  ];

  const columns = [
    { key: "pop", label: "POP Location" },
    { key: "bandwidth", label: "Bandwidth" },
    { key: "latency", label: "Latency" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { pop: "New York", bandwidth: "3.2TB", latency: "18ms", status: "Healthy" },
    { pop: "London", bandwidth: "2.8TB", latency: "22ms", status: "Healthy" },
    { pop: "Tokyo", bandwidth: "2.5TB", latency: "25ms", status: "Healthy" },
    { pop: "Singapore", bandwidth: "2.1TB", latency: "20ms", status: "Healthy" },
    { pop: "Sao Paulo", bandwidth: "1.8TB", latency: "28ms", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="CDN Operations" subtitle="CDN operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
