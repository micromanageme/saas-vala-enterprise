import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/stream-engineer")({
  head: () => ({ meta: [{ title: "Stream Engineer — SaaS Vala" }, { name: "description", content: "Stream engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: streamData, isLoading, error } = useQuery({
    queryKey: ["stream-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Stream Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Stream Engineer" subtitle="Stream engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Stream Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Stream Pipelines", value: "12", delta: "+2", up: true },
    { label: "Throughput", value: "850K/s", delta: "+100K/s", up: true },
    { label: "Processing Latency", value: "25ms", delta: "-5ms", up: true },
    { label: "Backpressure", value: "Low", delta: "—", up: true },
  ];

  const columns = [
    { key: "pipeline", label: "Stream Pipeline" },
    { key: "source", label: "Source" },
    { key: "destination", label: "Destination" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { pipeline: "User Activity Stream", source: "Kafka", destination: "Analytics", status: "Running" },
    { pipeline: "Real-time Analytics", source: "Events", destination: "Dashboard", status: "Running" },
    { pipeline: "Fraud Detection", source: "Transactions", destination: "Alerts", status: "Running" },
    { pipeline: "Data Enrichment", source: "CDC", destination: "Lake", status: "Running" },
    { pipeline: "ML Feature Pipeline", source: "Events", destination: "Feature Store", status: "Running" },
  ];

  return (
    <AppShell>
      <ModulePage title="Stream Engineer" subtitle="Stream engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
