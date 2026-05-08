import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/service-orchestrator")({
  head: () => ({ meta: [{ title: "Service Orchestrator — SaaS Vala" }, { name: "description", content: "Service orchestration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: orchestrationData, isLoading, error } = useQuery({
    queryKey: ["service-orchestrator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Service Orchestrator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Service Orchestrator" subtitle="Service orchestration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Service Orchestrator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Services Orchestrated", value: "125", delta: "+15", up: true },
    { label: "Workflows Active", value: "45", delta: "+5", up: true },
    { label: "Success Rate", value: "98%", delta: "+1%", up: true },
    { label: "Avg Latency", value: "50ms", delta: "-10ms", up: true },
  ];

  const columns = [
    { key: "service", label: "Service" },
    { key: "status", label: "Status" },
    { key: "throughput", label: "Throughput" },
    { key: "health", label: "Health" },
  ];

  const rows = [
    { service: "SVC-001", status: "Active", throughput: "1K/s", health: "Healthy" },
    { service: "SVC-002", status: "Active", throughput: "2K/s", health: "Healthy" },
    { service: "SVC-003", status: "Standby", throughput: "0/s", health: "Healthy" },
    { service: "SVC-004", status: "Active", throughput: "1.5K/s", health: "Degraded" },
    { service: "SVC-005", status: "Active", throughput: "3K/s", health: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Service Orchestrator" subtitle="Service orchestration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
