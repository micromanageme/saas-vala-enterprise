import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({ meta: [{ title: "Subscriptions — SaaS Vala" }, { name: "description", content: "Recurring billing & MRR" }] }),
  component: Page,
});

function Page() {
  const { data: subscriptionsData, isLoading, error } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const response = await fetch("/api/subscriptions?type=all");
      if (!response.ok) throw new Error("Failed to fetch Subscriptions data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Subscriptions" subtitle="Recurring billing & MRR" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Subscriptions data</div>
      </AppShell>
    );
  }

  const data = subscriptionsData?.data;
  const kpis = data?.kpis ? [
    { label: "MRR", value: `$${(data.kpis.mrr / 1000).toFixed(0)}K`, delta: `+${data.kpis.mrrDelta}%`, up: data.kpis.mrrDelta > 0 },
    { label: "Active", value: data.kpis.active.toString(), delta: `+${data.kpis.activeDelta}%`, up: data.kpis.activeDelta > 0 },
    { label: "Churn", value: `${data.kpis.churn}%`, delta: `${data.kpis.churnDelta}%`, up: data.kpis.churnDelta < 0 },
    { label: "LTV", value: `$${data.kpis.ltv.toLocaleString()}`, delta: `+${data.kpis.ltvDelta}%`, up: data.kpis.ltvDelta > 0 }
  ];

  const columns = [{ key: "customer", label: "Customer" }, { key: "plan", label: "Plan" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }];
  const rows = data?.subscriptions?.map((sub: any) => ({
    customer: sub.customer,
    plan: sub.plan,
    amount: `$${sub.amount.toLocaleString()}`,
    status: sub.status
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Subscriptions" subtitle="Recurring billing & MRR" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
