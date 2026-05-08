import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/zone-manager")({
  head: () => ({ meta: [{ title: "Zone Manager — SaaS Vala" }, { name: "description", content: "Zone management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: zoneData, isLoading, error } = useQuery({
    queryKey: ["zone-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Zone Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Zone Manager" subtitle="Zone management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Zone Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Hubs Managed", value: "8", delta: "+1", up: true },
    { label: "Zone Revenue", value: "$850K", delta: "+$120K", up: true },
    { label: "Team Size", value: "45", delta: "+5", up: true },
    { label: "Performance Score", value: "92%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "hub", label: "Hub" },
    { key: "manager", label: "Manager" },
    { key: "revenue", label: "Revenue" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { hub: "North Hub", manager: "John Smith", revenue: "$250K", status: "Healthy" },
    { hub: "South Hub", manager: "Sarah Johnson", revenue: "$200K", status: "Healthy" },
    { hub: "East Hub", manager: "Mike Brown", revenue: "$180K", status: "Growing" },
    { hub: "West Hub", manager: "Emily Davis", revenue: "$150K", status: "Healthy" },
    { hub: "Central Hub", manager: "Alex Wilson", revenue: "$70K", status: "New" },
  ];

  return (
    <AppShell>
      <ModulePage title="Zone Manager" subtitle="Zone management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
