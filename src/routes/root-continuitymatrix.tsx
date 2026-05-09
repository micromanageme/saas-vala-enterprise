import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-continuitymatrix")({
  head: () => ({ meta: [{ title: "Universal Continuity Matrix — Universal Access Admin" }, { name: "description", content: "Civilization-grade resilience, ultra-long-term archival, multi-region continuity" }] }),
  component: Page,
});

function Page() {
  const { data: continuityData, isLoading, error } = useQuery({
    queryKey: ["root-continuitymatrix"],
    queryFn: async () => {
      const response = await fetch("/api/root/continuity-matrix?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch continuity matrix data");
      return response.json();
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Continuity Matrix" subtitle="Civilization-grade resilience, ultra-long-term archival, multi-region continuity" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Continuity Matrix data</div>
      </AppShell>
    );
  }

  const data = continuityData?.data;
  const resilience = data?.civilizationGradeResilience;
  const archival = data?.ultraLongTermArchival;

  const kpis = [
    { label: "Resilience Score", value: resilience?.resilienceScore?.toString() || "0/10", delta: "—", up: (resilience?.resilienceScore || 0) > 9 },
    { label: "Archives Verified", value: `${archival?.integrityVerified.toLocaleString()}/${archival?.totalArchives.toLocaleString()}`, delta: "—", up: archival?.corruptedArchives === 0 },
    { label: "Active Regions", value: `${data?.multiRegionContinuity?.activeRegions}/${data?.multiRegionContinuity?.totalRegions}`, delta: "—", up: true },
  ];

  const rows = [
    { metric: "Threat Mitigation", value: resilience?.threatMitigation || "0%", status: "OK" },
    { metric: "RTO", value: resilience?.recoveryTimeObjective || "—", status: "OK" },
    { metric: "Archival Years", value: archival?.archivalYears.toString() || "0", status: "OK" },
    { metric: "Total Drills", value: data?.catastrophicRecoveryOrchestration?.totalDrills.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Continuity Matrix" subtitle="Civilization-grade resilience, ultra-long-term archival, multi-region continuity" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
