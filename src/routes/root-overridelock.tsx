import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-overridelock")({
  head: () => ({ meta: [{ title: "Root Universal Override Lock — Universal Access Admin" }, { name: "description", content: "Override conflict arbitration, emergency override sequencing, irreversible safeguard barriers" }] }),
  component: Page,
});

function Page() {
  const { data: overrideData, isLoading, error } = useQuery({
    queryKey: ["root-overridelock"],
    queryFn: async () => {
      const response = await fetch("/api/root/universal-override-lock?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch universal override lock data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Universal Override Lock" subtitle="Override conflict arbitration, emergency override sequencing, irreversible safeguard barriers" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Universal Override Lock data</div>
      </AppShell>
    );
  }

  const data = overrideData?.data;
  const arbitration = data?.overrideConflictArbitration;
  const sequencing = data?.emergencyOverrideSequencing;

  const kpis = [
    { label: "Resolved Conflicts", value: `${arbitration?.resolvedConflicts}/${arbitration?.totalConflicts}`, delta: "—", up: true },
    { label: "Executed Sequences", value: `${sequencing?.executedSequences}/${sequencing?.totalSequences}`, delta: "—", up: true },
    { label: "Active Barriers", value: data?.irreversibleSafeguardBarriers?.activeBarriers.toString() || "0", delta: "—", up: true },
  ] : [];

  const rows = [
    { metric: "Avg Arbitration Time", value: arbitration?.avgArbitrationTime || "—", status: "OK" },
    { metric: "Avg Sequence Time", value: sequencing?.avgSequenceTime || "—", status: "OK" },
    { metric: "Barrier Strength", value: data?.irreversibleSafeguardBarriers?.barrierStrength || "—", status: "OK" },
    { metric: "Active Freezes", value: data?.criticalActionFreezeControl?.activeFreezes.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Universal Override Lock" subtitle="Override conflict arbitration, emergency override sequencing, irreversible safeguard barriers" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
