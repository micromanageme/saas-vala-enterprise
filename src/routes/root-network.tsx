import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-network")({
  head: () => ({ meta: [{ title: "Root Network Operations — Universal Access Admin" }, { name: "description", content: "DNS routing, gateway traffic, proxy management" }] }),
  component: Page,
});

function Page() {
  const { data: networkData, isLoading, error } = useQuery({
    queryKey: ["root-network"],
    queryFn: async () => {
      const response = await fetch("/api/root/network?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch network data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Network Operations" subtitle="DNS routing, gateway traffic, proxy management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Network Operations data</div>
      </AppShell>
    );
  }

  const data = networkData?.data;
  const edgeNodes = data?.edgeNodes || [];
  const gateway = data?.gateway;

  const kpis = gateway ? [
    { label: "Total Requests", value: gateway.totalRequests.toLocaleString(), delta: "—", up: true },
    { label: "Success Rate", value: `${((gateway.successfulRequests / gateway.totalRequests) * 100).toFixed(2)}%`, delta: "—", up: true },
    { label: "Avg Latency", value: gateway.avgLatency, delta: "—", up: true },
    { label: "Throughput", value: gateway.throughput, delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
    { key: "traffic", label: "Traffic" },
    { key: "latency", label: "Latency" },
  ];

  const rows = edgeNodes.map((e: any) => ({
    location: e.location,
    status: e.status,
    traffic: e.traffic,
    latency: e.latency,
  }));

  return (
    <AppShell>
      <ModulePage title="Root Network Operations" subtitle="DNS routing, gateway traffic, proxy management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
