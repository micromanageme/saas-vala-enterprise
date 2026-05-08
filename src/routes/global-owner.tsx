import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/global-owner")({
  head: () => ({ meta: [{ title: "Global Owner — SaaS Vala" }, { name: "description", content: "Global business ownership and oversight" }] }),
  component: Page,
});

function Page() {
  const { data: ownerData, isLoading, error } = useQuery({
    queryKey: ["global-owner-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Global Owner data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Global Owner" subtitle="Global business ownership and oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Global Owner data</div>
      </AppShell>
    );
  }

  const data = ownerData?.data;
  const kpis = data?.kpis ? [
    { label: "Revenue", value: `$${(data.kpis.revenue / 1000000).toFixed(2)}M`, delta: `+${data.kpis.revenueDelta}%`, up: data.kpis.revenueDelta > 0 },
    { label: "EBITDA", value: `$${(data.kpis.ebitda / 1000000).toFixed(2)}M`, delta: `+${data.kpis.ebitdaDelta}%`, up: data.kpis.ebitdaDelta > 0 },
    { label: "Total Companies", value: data.kpis.totalCompanies?.toLocaleString() || "0", delta: "—", up: true },
    { label: "Global Regions", value: data.kpis.globalRegions?.toString() || "0", delta: "—", up: true },
  ] : [];

  const columns = [{ key: "region", label: "Region" }, { key: "revenue", label: "Revenue" }, { key: "growth", label: "Growth" }, { key: "status", label: "Status" }];
  const rows = data?.regions?.map((r: any) => ({
    region: r.region,
    revenue: `$${(r.revenue / 1000).toFixed(0)}K`,
    growth: `+${r.growth}%`,
    status: r.status,
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Global Owner" subtitle="Global business ownership and oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
