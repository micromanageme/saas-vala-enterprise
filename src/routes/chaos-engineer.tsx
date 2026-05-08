import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/chaos-engineer")({
  head: () => ({ meta: [{ title: "Chaos Engineer — SaaS Vala" }, { name: "description", content: "Chaos engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: chaosData, isLoading, error } = useQuery({
    queryKey: ["chaos-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Chaos Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Chaos Engineer" subtitle="Chaos engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Chaos Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Experiments Run", value: "45", delta: "+8", up: true },
    { label: "Weaknesses Found", value: "8", delta: "+2", up: false },
    { label: "System Resilience", value: "92%", delta: "+4%", up: true },
    { label: "MTBF", value: "720h", delta: "+120h", up: true },
  ];

  const columns = [
    { key: "experiment", label: "Chaos Experiment" },
    { key: "target", label: "Target" },
    { key: "result", label: "Result" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { experiment: "Pod Termination", target: "API Cluster", result: "Passed", status: "Complete" },
    { experiment: "Network Latency", target: "Database", result: "Passed", status: "Complete" },
    { experiment: "CPU Stress", target: "Worker Nodes", result: "Degraded", status: "Review" },
    { experiment: "Disk Failure", target: "Storage", result: "Passed", status: "Complete" },
    { experiment: "Zone Outage", target: "Multi-Region", result: "Passed", status: "Complete" },
  ];

  return (
    <AppShell>
      <ModulePage title="Chaos Engineer" subtitle="Chaos engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
