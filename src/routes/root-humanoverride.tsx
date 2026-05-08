import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-humanoverride")({
  head: () => ({ meta: [{ title: "Universal Human-Override Layer — Universal Access Admin" }, { name: "description", content: "Manual authority override, emergency command priority, irreversible action arbitration" }] }),
  component: Page,
});

function Page() {
  const { data: overrideData, isLoading, error } = useQuery({
    queryKey: ["root-humanoverride"],
    queryFn: async () => {
      const response = await fetch("/api/root/human-override?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch human-override data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Human-Override Layer" subtitle="Manual authority override, emergency command priority, irreversible action arbitration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Human-Override Layer data</div>
      </AppShell>
    );
  }

  const data = overrideData?.data;
  const overrides = data?.manualOverrides || [];
  const emergency = data?.emergencyCommandPriority;

  const kpis = emergency ? [
    { label: "Commands Executed", value: `${emergency.executedCommands}/${emergency.totalCommands}`, delta: "—", up: true },
    { label: "Approved Actions", value: `${data?.irreversibleActionArbitration?.approvedActions}/${data?.irreversibleActionArbitration?.totalActions}`, delta: "—", up: true },
    { label: "Dual Auth Workflows", value: data?.dualAuthorizationWorkflows?.completedWorkflows.toString() || "0", delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "type", label: "Type" },
    { key: "target", label: "Target" },
    { key: "authorizedBy", label: "Authorized By" },
    { key: "timestamp", label: "Timestamp" },
  ];

  const rows = overrides.map((o: any) => ({
    type: o.type,
    target: o.target,
    authorizedBy: o.authorizedBy,
    timestamp: new Date(o.timestamp).toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Human-Override Layer" subtitle="Manual authority override, emergency command priority, irreversible action arbitration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
