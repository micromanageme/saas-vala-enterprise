import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/traffic-routing-engineer")({
  head: () => ({ meta: [{ title: "Traffic Routing Engineer — SaaS Vala" }, { name: "description", content: "Traffic routing engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: trafficData, isLoading, error } = useQuery({
    queryKey: ["traffic-routing-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Traffic Routing Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Traffic Routing Engineer" subtitle="Traffic routing engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Traffic Routing Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Routes Configured", value: "100", delta: "+10", up: true },
    { label: "Traffic Routed", value: "100GB", delta: "+10GB", up: true },
    { label: "Routing Accuracy", value: "99%", delta: "+0.5%", up: true },
    { label: "Failovers", value: "2", delta: "-1", up: true },
  ];

  const columns = [
    { key: "route", label: "Traffic Route" },
    { key: "source", label: "Source" },
    { key: "destination", label: "Destination" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { route: "RTE-001", source: "Region A", destination: "Region B", status: "Active" },
    { route: "RTE-002", source: "Region C", destination: "Region D", status: "Active" },
    { route: "RTE-003", source: "Region E", destination: "Region F", status: "Active" },
    { route: "RTE-004", source: "Region G", destination: "Region H", status: "In Review" },
    { route: "RTE-005", source: "Region I", destination: "Region J", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Traffic Routing Engineer" subtitle="Traffic routing engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
