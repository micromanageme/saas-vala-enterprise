import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-microauthority")({
  head: () => ({ meta: [{ title: "Micro Authority Propagation — Universal Access Admin" }, { name: "description", content: "Permission propagation timing, nested inheritance validation, stale authority cleanup" }] }),
  component: Page,
});

function Page() {
  const { data: authorityData, isLoading, error } = useQuery({
    queryKey: ["root-microauthority"],
    queryFn: async () => {
      const response = await fetch("/api/root/micro-authority-propagation?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch micro authority propagation data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Micro Authority Propagation" subtitle="Permission propagation timing, nested inheritance validation, stale authority cleanup" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Micro Authority Propagation data</div>
      </AppShell>
    );
  }

  const data = authorityData?.data;
  const timing = data?.permissionPropagationTiming;
  const inheritance = data?.nestedInheritanceValidation;

  const kpis = [
    { label: "Avg Propagation Time", value: timing?.avgPropagationTime || "0ms", delta: "—", up: true },
    { label: "Valid Inheritances", value: `${inheritance?.validInheritances}/${inheritance?.totalValidations}`, delta: "—", up: inheritance?.invalidInheritances === 0 },
    { label: "Cleanup Rate", value: data?.staleAuthorityCleanup?.cleanupRate || "0%", delta: "—", up: data?.staleAuthorityCleanup?.cleanupRate === '100%' },
  ] : [];

  const rows = [
    { metric: "Total Propagations", value: timing?.totalPropagations.toString() || "0", status: "OK" },
    { metric: "Max Nesting Depth", value: inheritance?.maxNestingDepth.toString() || "0", status: "OK" },
    { metric: "Authorities Cleaned", value: data?.staleAuthorityCleanup?.authoritiesCleaned.toString() || "0", status: "OK" },
    { metric: "Resolved Conflicts", value: data?.authorityConflictArbitration?.resolvedConflicts.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Micro Authority Propagation" subtitle="Permission propagation timing, nested inheritance validation, stale authority cleanup" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
