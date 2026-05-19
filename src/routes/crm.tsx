import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";

export const Route = createFileRoute("/crm")({
  head: () => ({ meta: [{ title: "CRM — SaaS Vala" }, { name: "description", content: "Leads, opportunities & customer pipeline" }] }),
  component: Page,
});

function Page() {
  const { data: crmData, isLoading, error, refetch } = useQuery({
    queryKey: ["crm"],
    queryFn: async () => {
      const response = await fetch("/api/crm?type=all");
      if (!response.ok) throw new Error("Failed to fetch CRM data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="CRM" subtitle="Leads, opportunities & customer pipeline" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="CRM"
          subtitle="Leads, opportunities & customer pipeline"
          message="We couldn't load CRM data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = crmData?.data;
  const kpis = data?.kpis ? [
    { label: "Open Leads", value: data.kpis.openLeads.toString(), delta: `+${data.kpis.openLeadsDelta}%`, up: data.kpis.openLeadsDelta > 0 },
    { label: "Won Deals", value: `$${(data.kpis.wonDeals / 1000).toFixed(0)}K`, delta: `+${data.kpis.wonDealsDelta}%`, up: data.kpis.wonDealsDelta > 0 },
    { label: "Win Rate", value: `${data.kpis.winRate}%`, delta: `+${data.kpis.winRateDelta}%`, up: data.kpis.winRateDelta > 0 },
    { label: "Avg Cycle", value: `${data.kpis.avgCycle}d`, delta: `${data.kpis.avgCycleDelta}d`, up: data.kpis.avgCycleDelta < 0 }
  ] : [];

  const columns = [{ key: "name", label: "Customer" }, { key: "stage", label: "Stage" }, { key: "value", label: "Value" }, { key: "owner", label: "Owner" }];
  const rows = data?.leads?.map((lead: any) => ({
    name: lead.name,
    stage: lead.stage,
    value: `$${lead.value.toLocaleString()}`,
    owner: lead.owner
  })) || [];

  return (
    <AppShell>
      <ModulePage title="CRM" subtitle="Leads, opportunities & customer pipeline" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
