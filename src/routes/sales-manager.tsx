import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/sales-manager")({
  head: () => ({ meta: [{ title: "Sales Manager — SaaS Vala" }, { name: "description", content: "Sales team management" }] }),
  component: Page,
});

function Page() {
  const { data: salesData, isLoading, error } = useQuery({
    queryKey: ["sales-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Sales Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Sales Manager" subtitle="Sales team management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Sales Manager data</div>
      </AppShell>
    );
  }

  const data = salesData?.analytics;
  const kpis = data ? [
    { label: "Team Revenue", value: `$${(data.revenue?.total / 1000).toFixed(0)}K`, delta: "+18%", up: true },
    { label: "Deals Closed", value: "23", delta: "+5", up: true },
    { label: "Pipeline Value", value: `$450K`, delta: "+12%", up: true },
    { label: "Win Rate", value: "34%", delta: "+3%", up: true },
  ] : [];

  const columns = [
    { key: "salesperson", label: "Salesperson" },
    { key: "revenue", label: "Revenue" },
    { key: "deals", label: "Deals" },
    { key: "quota", label: "Quota" },
  ];

  const rows = [
    { salesperson: "John Smith", revenue: "$85K", deals: "8", quota: "92%" },
    { salesperson: "Sarah Johnson", revenue: "$72K", deals: "6", quota: "88%" },
    { salesperson: "Mike Brown", revenue: "$65K", deals: "5", quota: "82%" },
    { salesperson: "Emily Davis", revenue: "$58K", deals: "4", quota: "75%" },
    { salesperson: "Alex Wilson", revenue: "$95K", deals: "9", quota: "105%" },
  ];

  return (
    <AppShell>
      <ModulePage title="Sales Manager" subtitle="Sales team management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
