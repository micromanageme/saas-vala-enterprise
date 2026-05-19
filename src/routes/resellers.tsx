import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";

export const Route = createFileRoute("/resellers")({
  head: () => ({ meta: [{ title: "Reseller System — SaaS Vala" }, { name: "description", content: "Channel partners & commissions" }] }),
  component: Page,
});

function Page() {
  const { data: resellersData, isLoading, error, refetch } = useQuery({
    queryKey: ["resellers"],
    queryFn: async () => {
      const response = await fetch("/api/resellers?type=all");
      if (!response.ok) throw new Error("Failed to fetch Resellers data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Reseller System" subtitle="Channel partners & commissions" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Reseller System"
          subtitle="Channel partners & commissions"
          message="We couldn't load Resellers data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = resellersData?.data;
  const kpis = data?.kpis ? [
    { label: "Resellers", value: data.kpis.resellers.toString(), delta: `+${data.kpis.resellersDelta}`, up: data.kpis.resellersDelta > 0 },
    { label: "Active", value: data.kpis.active.toString(), delta: `+${data.kpis.activeDelta}`, up: data.kpis.activeDelta > 0 },
    { label: "Sales", value: `$${(data.kpis.sales / 1000).toFixed(0)}K`, delta: `+${data.kpis.salesDelta}%`, up: data.kpis.salesDelta > 0 },
    { label: "Commission", value: `$${(data.kpis.commission / 1000).toFixed(0)}K`, delta: `+${data.kpis.commissionDelta}%`, up: data.kpis.commissionDelta > 0 }
  ] : [];

  const columns = [{ key: "name", label: "Reseller" }, { key: "tier", label: "Tier" }, { key: "sales", label: "Sales" }, { key: "commission", label: "Commission" }];
  const rows = data?.resellers?.map((r: any) => ({
    name: r.name,
    tier: r.tier,
    sales: `$${r.sales.toLocaleString()}`,
    commission: `$${r.commission.toLocaleString()}`
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Reseller System" subtitle="Channel partners & commissions" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
