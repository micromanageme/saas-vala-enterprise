import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/smart-grid-manager")({
  head: () => ({ meta: [{ title: "Smart Grid Manager — SaaS Vala" }, { name: "description", content: "Smart grid management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: gridData, isLoading, error } = useQuery({
    queryKey: ["smart-grid-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Smart Grid Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Smart Grid Manager" subtitle="Smart grid management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Smart Grid Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Smart Meters", value: "125K", delta: "+5K", up: true },
    { label: "Grid Efficiency", value: "94%", delta: "+1%", up: true },
    { label: "Demand Response", value: "78%", delta: "+3%", up: true },
    { label: "Load Balancing", value: "92%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "zone", label: "Grid Zone" },
    { key: "load", label: "Current Load" },
    { key: "capacity", label: "Capacity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { zone: "Zone A - Residential", load: "85 MW", capacity: "100 MW", status: "Normal" },
    { zone: "Zone B - Commercial", load: "120 MW", capacity: "150 MW", status: "Normal" },
    { zone: "Zone C - Industrial", load: "180 MW", capacity: "200 MW", status: "High" },
    { zone: "Zone D - Mixed", load: "95 MW", capacity: "120 MW", status: "Normal" },
    { zone: "Zone E - Rural", load: "45 MW", capacity: "80 MW", status: "Low" },
  ];

  return (
    <AppShell>
      <ModulePage title="Smart Grid Manager" subtitle="Smart grid management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
