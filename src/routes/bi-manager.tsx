import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/bi-manager")({
  head: () => ({ meta: [{ title: "BI Manager — SaaS Vala" }, { name: "description", content: "Business Intelligence management" }] }),
  component: Page,
});

function Page() {
  const { data: biData, isLoading, error } = useQuery({
    queryKey: ["bi-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch BI Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="BI Manager" subtitle="Business Intelligence management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load BI Manager data</div>
      </AppShell>
    );
  }

  const data = biData?.analytics;
  const kpis = data ? [
    { label: "Dashboards", value: "23", delta: "+3", up: true },
    { label: "Reports Generated", value: "45", delta: "+8", up: true },
    { label: "Data Sources", value: "8", delta: "+1", up: true },
    { label: "Users Served", value: "156", delta: "+12", up: true },
  ];

  const columns = [
    { key: "dashboard", label: "Dashboard" },
    { key: "views", label: "Views" },
    { key: "lastUpdated", label: "Last Updated" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { dashboard: "Executive Overview", views: "1,234", lastUpdated: "2h ago", status: "Active" },
    { dashboard: "Sales Performance", views: "856", lastUpdated: "4h ago", status: "Active" },
    { dashboard: "Financial Summary", views: "678", lastUpdated: "1d ago", status: "Active" },
    { dashboard: "Customer Analytics", views: "534", lastUpdated: "6h ago", status: "Active" },
    { dashboard: "Operations Dashboard", views: "423", lastUpdated: "3h ago", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="BI Manager" subtitle="Business Intelligence management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
