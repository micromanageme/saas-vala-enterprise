import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/forestry-manager")({
  head: () => ({ meta: [{ title: "Forestry Manager — SaaS Vala" }, { name: "description", content: "Forestry management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: forestryData, isLoading, error } = useQuery({
    queryKey: ["forestry-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Forestry Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Forestry Manager" subtitle="Forestry management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Forestry Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Forest Area", value: "25K acres", delta: "+2K acres", up: true },
    { label: "Trees Harvested", value: "450", delta: "+50", up: true },
    { label: "Reforestation", value: "85%", delta: "+5%", up: true },
    { label: "Carbon Credits", value: "12.5K", delta: "+1.5K", up: true },
  ];

  const columns = [
    { key: "forest", label: "Forest" },
    { key: "type", label: "Type" },
    { key: "area", label: "Area (acres)" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { forest: "FOR-001", type: "Pine", area: "5,000", status: "Active" },
    { forest: "FOR-002", type: "Oak", area: "3,500", status: "Active" },
    { forest: "FOR-003", type: "Mixed", area: "8,000", status: "Active" },
    { forest: "FOR-004", type: "Pine", area: "4,500", status: "Replanting" },
    { forest: "FOR-005", type: "Oak", area: "4,000", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Forestry Manager" subtitle="Forestry management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
