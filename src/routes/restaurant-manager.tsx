import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/restaurant-manager")({
  head: () => ({ meta: [{ title: "Restaurant Manager — SaaS Vala" }, { name: "description", content: "Restaurant management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: restaurantData, isLoading, error } = useQuery({
    queryKey: ["restaurant-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Restaurant Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Restaurant Manager" subtitle="Restaurant management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Restaurant Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Daily Covers", value: "450", delta: "+50", up: true },
    { label: "Table Turnover", value: "2.5x", delta: "+0.3x", up: true },
    { label: "Food Cost", value: "28%", delta: "-2%", up: true },
    { label: "Customer Rating", value: "4.7/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "table", label: "Table" },
    { key: "capacity", label: "Capacity" },
    { key: "status", label: "Status" },
    { key: "section", label: "Section" },
  ];

  const rows = [
    { table: "TBL-001", capacity: "4", status: "Occupied", section: "Main" },
    { table: "TBL-002", capacity: "6", status: "Available", section: "Main" },
    { table: "TBL-003", capacity: "2", status: "Available", section: "Bar" },
    { table: "TBL-004", capacity: "8", status: "Occupied", section: "Private" },
    { table: "TBL-005", capacity: "4", status: "Available", section: "Main" },
  ];

  return (
    <AppShell>
      <ModulePage title="Restaurant Manager" subtitle="Restaurant management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
