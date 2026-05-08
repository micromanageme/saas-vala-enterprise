import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-execution-authority")({
  head: () => ({ meta: [{ title: "Root Execution Authority — SaaS Vala" }, { name: "description", content: "Root execution authority workspace" }] }),
  component: Page,
});

function Page() {
  const { data: executionData, isLoading, error } = useQuery({
    queryKey: ["root-execution-authority-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Root Execution Authority data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Execution Authority" subtitle="Root execution authority workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Execution Authority data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Executions", value: "150", delta: "+15", up: true },
    { label: "Success Rate", value: "99%", delta: "+0.5%", up: true },
    { label: "Failures", value: "0", delta: "0", up: true },
    { label: "Execution Time", value: "10ms", delta: "-2ms", up: true },
  ];

  const columns = [
    { key: "execution", label: "Root Execution" },
    { key: "command", label: "Command" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { execution: "EXE-001", command: "System", duration: "5ms", status: "Completed" },
    { execution: "EXE-002", command: "Network", duration: "8ms", status: "Completed" },
    { execution: "EXE-003", command: "Security", duration: "10ms", status: "Completed" },
    { execution: "EXE-004", command: "Database", duration: "7ms", status: "Completed" },
    { execution: "EXE-005", command: "System", duration: "6ms", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Execution Authority" subtitle="Root execution authority workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
