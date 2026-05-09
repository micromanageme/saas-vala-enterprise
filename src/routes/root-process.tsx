import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-process")({
  head: () => ({ meta: [{ title: "Universal Process Orchestrator — Universal Access Admin" }, { name: "description", content: "Process lifecycle management, watchdog, recovery" }] }),
  component: Page,
});

function Page() {
  const { data: processData, isLoading, error } = useQuery({
    queryKey: ["root-process"],
    queryFn: async () => {
      const response = await fetch("/api/root/process-orchestrator?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch process orchestrator data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Process Orchestrator" subtitle="Process lifecycle management, watchdog, recovery" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Process Orchestrator data</div>
      </AppShell>
    );
  }

  const data = processData?.data;
  const processes = data?.processes || [];
  const watchdog = data?.watchdog;

  const kpis = watchdog ? [
    { label: "Monitored Processes", value: watchdog.monitoredProcesses.toString(), delta: "—", up: true },
    { label: "Healthy", value: watchdog.healthyProcesses.toString(), delta: "—", up: true },
    { label: "Stuck", value: watchdog.stuckProcesses.toString(), delta: "—", up: watchdog.stuckProcesses === 0 },
    { label: "Auto Restarted", value: watchdog.autoRestarted.toString(), delta: "—", up: true },
  ];

  const columns = [
    { key: "name", label: "Process" },
    { key: "status", label: "Status" },
    { key: "pid", label: "PID" },
    { key: "restarts", label: "Restarts" },
    { key: "uptime", label: "Uptime" },
  ];

  const rows = processes.map((p: any) => ({
    name: p.name,
    status: p.status,
    pid: p.pid.toString(),
    restarts: p.restarts.toString(),
    uptime: p.uptime,
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Process Orchestrator" subtitle="Process lifecycle management, watchdog, recovery" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
