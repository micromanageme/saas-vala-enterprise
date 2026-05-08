import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/hub-manager")({
  head: () => ({ meta: [{ title: "Hub Manager — SaaS Vala" }, { name: "description", content: "Hub management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: hubData, isLoading, error } = useQuery({
    queryKey: ["hub-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Hub Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Hub Manager" subtitle="Hub management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Hub Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Locations Managed", value: "5", delta: "+1", up: true },
    { label: "Hub Revenue", value: "$250K", delta: "+$45K", up: true },
    { label: "Team Size", value: "25", delta: "+3", up: true },
    { label: "Customer Satisfaction", value: "4.6/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "location", label: "Location" },
    { key: "manager", label: "Manager" },
    { key: "revenue", label: "Revenue" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { location: "Downtown", manager: "John Smith", revenue: "$80K", status: "Healthy" },
    { location: "Midtown", manager: "Sarah Johnson", revenue: "$65K", status: "Healthy" },
    { location: "Uptown", manager: "Mike Brown", revenue: "$55K", status: "Healthy" },
    { location: "Suburbs", manager: "Emily Davis", revenue: "35K", status: "Growing" },
    { location: "Airport", manager: "Alex Wilson", revenue: "$15K", status: "New" },
  ];

  return (
    <AppShell>
      <ModulePage title="Hub Manager" subtitle="Hub management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
