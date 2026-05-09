import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-terminal")({
  head: () => ({ meta: [{ title: "Universal Command Terminal — Universal Access Admin" }, { name: "description", content: "Secure command execution, diagnostic console, emergency scripts" }] }),
  component: Page,
});

function Page() {
  const { data: terminalData, isLoading, error } = useQuery({
    queryKey: ["root-terminal"],
    queryFn: async () => {
      const response = await fetch("/api/root/terminal?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch terminal data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Command Terminal" subtitle="Secure command execution, diagnostic console, emergency scripts" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Command Terminal data</div>
      </AppShell>
    );
  }

  const data = terminalData?.data;
  const commands = data?.recentCommands || [];
  const scripts = data?.emergencyScripts;
  const diagnostic = data?.diagnostic;

  const kpis = diagnostic ? [
    { label: "System Status", value: diagnostic.systemStatus, delta: "—", up: diagnostic.systemStatus === 'HEALTHY' },
    { label: "Issues Detected", value: diagnostic.issuesDetected.toString(), delta: "—", up: diagnostic.issuesDetected === 0 },
    { label: "Warnings", value: diagnostic.warnings.toString(), delta: "—", up: diagnostic.warnings === 0 },
    { label: "Scripts Ready", value: scripts?.length.toString() || "0", delta: "—", up: true },
  ];

  const columns = [
    { key: "command", label: "Command" },
    { key: "status", label: "Status" },
    { key: "executedBy", label: "Executed By" },
    { key: "timestamp", label: "Timestamp" },
  ];

  const rows = commands.map((c: any) => ({
    command: c.command,
    status: c.status,
    executedBy: c.executedBy,
    timestamp: new Date(c.timestamp).toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Command Terminal" subtitle="Secure command execution, diagnostic console, emergency scripts" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
