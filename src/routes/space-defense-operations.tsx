import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/space-defense-operations")({
  head: () => ({ meta: [{ title: "Space Defense Operations — SaaS Vala" }, { name: "description", content: "Space defense operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: spaceDefenseData, isLoading, error } = useQuery({
    queryKey: ["space-defense-operations-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Space Defense Operations data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Space Defense Operations" subtitle="Space defense operations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Space Defense Operations data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Satellites Tracked", value: "450", delta: "+25", up: true },
    { label: "Space Objects Monitored", value: "12.5K", delta: "+1.5K", up: true },
    { label: "Alerts Generated", value: "8", delta: "+2", up: false },
    { label: "System Uptime", value: "99.9%", delta: "+0.1%", up: true },
  ];

  const columns = [
    { key: "object", label: "Space Object" },
    { key: "orbit", label: "Orbit Type" },
    { key: "threat", label: "Threat Level" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { object: "SAT-001", orbit: "LEO", threat: "Low", status: "Tracked" },
    { object: "SAT-002", orbit: "GEO", threat: "Low", status: "Tracked" },
    { object: "DEBRIS-003", orbit: "LEO", threat: "Medium", status: "Monitoring" },
    { object: "SAT-004", orbit: "MEO", threat: "Low", status: "Tracked" },
    { object: "UNKNOWN-005", orbit: "HEO", threat: "High", status: "Investigating" },
  ];

  return (
    <AppShell>
      <ModulePage title="Space Defense Operations" subtitle="Space defense operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
