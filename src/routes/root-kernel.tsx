import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-kernel")({
  head: () => ({ meta: [{ title: "Root Kernel Control — Universal Access Admin" }, { name: "description", content: "System kernel monitoring and runtime process control" }] }),
  component: Page,
});

function Page() {
  const { data: kernelData, isLoading, error } = useQuery({
    queryKey: ["root-kernel"],
    queryFn: async () => {
      const response = await fetch("/api/root/kernel?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch kernel data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Kernel Control" subtitle="System kernel monitoring and runtime process control" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Kernel Control data</div>
      </AppShell>
    );
  }

  const data = kernelData?.data;
  const processes = data?.processes || [];
  const memory = data?.memory;

  const kpis = memory ? [
    { label: "Total Memory", value: memory.total, delta: "—", up: true },
    { label: "Used", value: memory.used, delta: "—", up: true },
    { label: "Free", value: memory.free, delta: "—", up: true },
    { label: "Swap Used", value: memory.swapUsed, delta: "—", up: memory.swapUsed === "0GB" },
  ];

  const columns = [
    { key: "name", label: "Process" },
    { key: "pid", label: "PID" },
    { key: "cpu", label: "CPU" },
    { key: "memory", label: "Memory" },
    { key: "status", label: "Status" },
  ];

  const rows = processes.map((p: any) => ({
    name: p.name,
    pid: p.pid.toString(),
    cpu: `${p.cpu}%`,
    memory: `${p.memory}MB`,
    status: p.status,
  }));

  return (
    <AppShell>
      <ModulePage title="Root Kernel Control" subtitle="System kernel monitoring and runtime process control" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
