import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-simulation")({
  head: () => ({ meta: [{ title: "Root Simulation Engine — Universal Access Admin" }, { name: "description", content: "Infrastructure simulation, deployment simulation, disaster simulation, load simulation" }] }),
  component: Page,
});

function Page() {
  const { data: simulationData, isLoading, error } = useQuery({
    queryKey: ["root-simulation"],
    queryFn: async () => {
      const response = await fetch("/api/root/simulation-engine?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch simulation engine data");
      return response.json();
    },
    refetchInterval: 20000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Simulation Engine" subtitle="Infrastructure simulation, deployment simulation, disaster simulation, load simulation" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Simulation Engine data</div>
      </AppShell>
    );
  }

  const data = simulationData?.data;
  const simulations = data?.simulations || [];
  const infra = data?.infrastructureSimulation;

  const kpis = infra ? [
    { label: "Total Simulations", value: infra.totalSimulations.toString(), delta: "—", up: true },
    { label: "Successful", value: infra.successfulSimulations.toString(), delta: "—", up: true },
    { label: "Failed", value: infra.failedSimulations.toString(), delta: "—", up: infra.failedSimulations === 0 },
  ] : [];

  const columns = [
    { key: "name", label: "Simulation" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "duration", label: "Duration" },
  ];

  const rows = simulations.map((s: any) => ({
    name: s.name,
    type: s.type,
    status: s.status,
    duration: s.duration || "—",
  }));

  return (
    <AppShell>
      <ModulePage title="Root Simulation Engine" subtitle="Infrastructure simulation, deployment simulation, disaster simulation, load simulation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
