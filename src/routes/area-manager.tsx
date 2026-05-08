import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/area-manager")({
  head: () => ({ meta: [{ title: "Area Manager — SaaS Vala" }, { name: "description", content: "Area management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: areaData, isLoading, error } = useQuery({
    queryKey: ["area-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Area Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Area Manager" subtitle="Area management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Area Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Locations Managed", value: "5", delta: "+1", up: true },
    { label: "Area Revenue", value: "$850K", delta: "+$120K", up: true },
    { label: "Team Performance", value: "94%", delta: "+2%", up: true },
    { label: "Customer Satisfaction", value: "4.6/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "location", label: "Location" },
    { key: "manager", label: "Manager" },
    { key: "revenue", label: "Revenue" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { location: "Downtown", manager: "John Smith", revenue: "$280K", status: "Healthy" },
    { location: "Midtown", manager: "Sarah Johnson", revenue: "$220K", status: "Healthy" },
    { location: "Uptown", manager: "Mike Brown", revenue: "$180K", status: "Healthy" },
    { location: "Suburbs", manager: "Emily Davis", revenue: "$120K", status: "Growing" },
    { location: "Airport", manager: "Alex Wilson", revenue: "$50K", status: "New" },
  ];

  return (
    <AppShell>
      <ModulePage title="Area Manager" subtitle="Area management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
