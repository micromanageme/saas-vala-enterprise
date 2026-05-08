import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/railway-operations-manager")({
  head: () => ({ meta: [{ title: "Railway Operations Manager — SaaS Vala" }, { name: "description", content: "Railway operations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: railwayData, isLoading, error } = useQuery({
    queryKey: ["railway-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Railway Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Railway Operations Manager" subtitle="Railway operations management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Railway Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Trains Operating", value: "85", delta: "+5", up: true },
    { label: "Passengers Transported", value: "125K", delta: "+8K", up: true },
    { label: "On-Time Performance", value: "96%", delta: "+1%", up: true },
    { label: "Track Utilization", value: "82%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "train", label: "Train" },
    { key: "route", label: "Route" },
    { key: "capacity", label: "Capacity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { train: "TR-001", route: "Northern Line", capacity: "1,200", status: "On Time" },
    { train: "TR-002", route: "Southern Line", capacity: "950", status: "Delayed" },
    { train: "TR-003", route: "Eastern Line", capacity: "1,100", status: "On Time" },
    { train: "TR-004", route: "Western Line", capacity: "800", status: "On Time" },
    { train: "TR-005", route: "Central Line", capacity: "1,500", status: "On Time" },
  ];

  return (
    <AppShell>
      <ModulePage title="Railway Operations Manager" subtitle="Railway operations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
