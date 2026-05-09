import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/franchises")({
  head: () => ({ meta: [{ title: "Franchise System — SaaS Vala" }, { name: "description", content: "Franchisee network" }] }),
  component: Page,
});

function Page() {
  const { data: franchisesData, isLoading, error } = useQuery({
    queryKey: ["franchises"],
    queryFn: async () => {
      const response = await fetch("/api/franchises?type=all");
      if (!response.ok) throw new Error("Failed to fetch Franchises data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Franchise System" subtitle="Franchisee network" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Franchises data</div>
      </AppShell>
    );
  }

  const data = franchisesData?.data;
  const kpis = data?.kpis ? [
    { label: "Franchises", value: data.kpis.franchises.toString(), delta: `+${data.kpis.franchisesDelta}`, up: data.kpis.franchisesDelta > 0 },
    { label: "Active", value: data.kpis.active.toString(), delta: `+${data.kpis.activeDelta}`, up: data.kpis.activeDelta > 0 },
    { label: "Locations", value: data.kpis.locations.toString(), delta: `+${data.kpis.locationsDelta}`, up: data.kpis.locationsDelta > 0 },
    { label: "Royalties", value: `$${(data.kpis.royalties / 1000).toFixed(0)}K`, delta: `+${data.kpis.royaltiesDelta}%`, up: data.kpis.royaltiesDelta > 0 }
  ] : [];

  const columns = [{ key: "name", label: "Franchisee" }, { key: "region", label: "Region" }, { key: "locations", label: "Locations" }, { key: "status", label: "Status" }];
  const rows = data?.franchises?.map((f: any) => ({
    name: f.name,
    region: f.region,
    locations: f.locations.toString(),
    status: f.status
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Franchise System" subtitle="Franchisee network" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
