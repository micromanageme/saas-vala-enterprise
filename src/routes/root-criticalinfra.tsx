import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-criticalinfra")({
  head: () => ({ meta: [{ title: "Root Critical Infrastructure Control — Universal Access Admin" }, { name: "description", content: "Mission-critical systems, high-availability zones, emergency routing, national-grade redundancy" }] }),
  component: Page,
});

function Page() {
  const { data: infraData, isLoading, error } = useQuery({
    queryKey: ["root-criticalinfra"],
    queryFn: async () => {
      const response = await fetch("/api/root/critical-infrastructure?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch critical infrastructure data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Critical Infrastructure Control" subtitle="Mission-critical systems, high-availability zones, emergency routing, national-grade redundancy" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Critical Infrastructure Control data</div>
      </AppShell>
    );
  }

  const data = infraData?.data;
  const systems = data?.criticalSystems || [];
  const zones = data?.highAvailabilityZones;

  const kpis = zones ? [
    { label: "Total Zones", value: zones.totalZones.toString(), delta: "—", up: true },
    { label: "Active Zones", value: zones.activeZones.toString(), delta: "—", up: true },
    { label: "Failover Ready", value: zones.failoverReady ? "Yes" : "No", delta: "—", up: zones.failoverReady },
  ];

  const columns = [
    { key: "name", label: "System" },
    { key: "status", label: "Status" },
    { key: "availability", label: "Availability" },
    { key: "zone", label: "Zone" },
  ];

  const rows = systems.map((s: any) => ({
    name: s.name,
    status: s.status,
    availability: s.availability,
    zone: s.zone,
  }));

  return (
    <AppShell>
      <ModulePage title="Root Critical Infrastructure Control" subtitle="Mission-critical systems, high-availability zones, emergency routing, national-grade redundancy" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
