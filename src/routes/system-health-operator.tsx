import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/system-health-operator")({
  head: () => ({ meta: [{ title: "System Health Operator — SaaS Vala" }, { name: "description", content: "System health operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: healthData, isLoading, error } = useQuery({
    queryKey: ["system-health-operator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch System Health Operator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="System Health Operator" subtitle="System health operations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load System Health Operator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "System Uptime", value: "99.9%", delta: "+0.1%", up: true },
    { label: "Health Score", value: "95", delta: "+3", up: true },
    { label: "Alerts", value: "8", delta: "-2", up: true },
    { label: "Response Time", value: "50ms", delta: "-5ms", up: true },
  ];

  const columns = [
    { key: "system", label: "System Component" },
    { key: "status", label: "Status" },
    { key: "load", label: "Load" },
    { key: "health", label: "Health" },
  ];

  const rows = [
    { system: "SYS-001", status: "Healthy", load: "45%", health: "95" },
    { system: "SYS-002", status: "Healthy", load: "60%", health: "92" },
    { system: "SYS-003", status: "Warning", load: "85%", health: "75" },
    { system: "SYS-004", status: "Healthy", load: "30%", health: "98" },
    { system: "SYS-005", status: "Healthy", load: "55%", health: "93" },
  ];

  return (
    <AppShell>
      <ModulePage title="System Health Operator" subtitle="System health operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
