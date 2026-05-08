import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/energy-manager")({
  head: () => ({ meta: [{ title: "Energy Manager — SaaS Vala" }, { name: "description", content: "Energy management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: energyData, isLoading, error } = useQuery({
    queryKey: ["energy-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Energy Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Energy Manager" subtitle="Energy management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Energy Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Power Generated", value: "450 MW", delta: "+25 MW", up: true },
    { label: "Grid Stability", value: "99.5%", delta: "+0.2%", up: true },
    { label: "Renewable Mix", value: "65%", delta: "+3%", up: true },
    { label: "Outage Rate", value: "0.05%", delta: "-0.02%", up: true },
  ];

  const columns = [
    { key: "source", label: "Energy Source" },
    { key: "capacity", label: "Capacity" },
    { key: "output", label: "Current Output" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { source: "Solar Farm A", capacity: "100 MW", output: "85 MW", status: "Active" },
    { source: "Wind Farm B", capacity: "150 MW", output: "120 MW", status: "Active" },
    { source: "Hydro Plant C", capacity: "200 MW", output: "180 MW", status: "Active" },
    { source: "Gas Turbine D", capacity: "100 MW", output: "45 MW", status: "Standby" },
    { source: "Battery Storage E", capacity: "50 MW", output: "20 MW", status: "Discharging" },
  ];

  return (
    <AppShell>
      <ModulePage title="Energy Manager" subtitle="Energy management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
