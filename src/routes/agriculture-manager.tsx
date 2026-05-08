import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/agriculture-manager")({
  head: () => ({ meta: [{ title: "Agriculture Manager — SaaS Vala" }, { name: "description", content: "Agriculture management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: agricultureData, isLoading, error } = useQuery({
    queryKey: ["agriculture-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Agriculture Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Agriculture Manager" subtitle="Agriculture management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Agriculture Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Farms Managed", value: "45", delta: "+3", up: true },
    { label: "Crop Yield", value: "2.5K tons", delta: "+200 tons", up: true },
    { label: "Harvest Efficiency", value: "92%", delta: "+2%", up: true },
    { label: "Weather Impact", value: "Low", delta: "—", up: true },
  ];

  const columns = [
    { key: "farm", label: "Farm" },
    { key: "crop", label: "Primary Crop" },
    { key: "area", label: "Area (acres)" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { farm: "FARM-001", crop: "Wheat", area: "500", status: "Active" },
    { farm: "FARM-002", crop: "Corn", area: "750", status: "Active" },
    { farm: "FARM-003", crop: "Rice", area: "600", status: "Active" },
    { farm: "FARM-004", crop: "Soybeans", area: "450", status: "Active" },
    { farm: "FARM-005", crop: "Barley", area: "350", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="Agriculture Manager" subtitle="Agriculture management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
