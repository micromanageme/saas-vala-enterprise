import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/universal-telemetry-admin")({
  head: () => ({ meta: [{ title: "Universal Telemetry Admin — SaaS Vala" }, { name: "description", content: "Universal telemetry administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: telemetryData, isLoading, error } = useQuery({
    queryKey: ["universal-telemetry-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Universal Telemetry Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Telemetry Admin" subtitle="Universal telemetry administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Telemetry Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Metrics Collected", value: "5M", delta: "+500K", up: true },
    { label: "Data Points/Second", value: "50K", delta: "+5K", up: true },
    { label: "Retention", value: "30 days", delta: "+5 days", up: true },
    { label: "Query Latency", value: "100ms", delta: "-20ms", up: true },
  ];

  const columns = [
    { key: "source", label: "Telemetry Source" },
    { key: "type", label: "Type" },
    { key: "throughput", label: "Throughput" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { source: "SRC-001", type: "Metrics", throughput: "20K/s", status: "Active" },
    { source: "SRC-002", type: "Logs", throughput: "15K/s", status: "Active" },
    { source: "SRC-003", type: "Traces", throughput: "10K/s", status: "Active" },
    { source: "SRC-004", type: "Events", throughput: "5K/s", status: "Active" },
    { source: "SRC-005", type: "Metrics", throughput: "25K/s", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Telemetry Admin" subtitle="Universal telemetry administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
