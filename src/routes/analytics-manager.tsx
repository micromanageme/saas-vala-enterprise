import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/analytics-manager")({
  head: () => ({ meta: [{ title: "Analytics Manager — SaaS Vala" }, { name: "description", content: "Analytics operations management" }] }),
  component: Page,
});

function Page() {
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ["analytics-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Analytics Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Analytics Manager" subtitle="Analytics operations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Analytics Manager data</div>
      </AppShell>
    );
  }

  const data = analyticsData?.analytics;
  const kpis = data ? [
    { label: "Reports Generated", value: "1,234", delta: "+18%", up: true },
    { label: "Data Points", value: "45.2M", delta: "+22%", up: true },
    { label: "Dashboards Active", value: "89", delta: "+5", up: true },
    { label: "Data Freshness", value: "Real-time", delta: "—", up: true },
  ];

  const columns = [
    { key: "report", label: "Report" },
    { key: "type", label: "Type" },
    { key: "runs", label: "Runs" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { report: "Daily Revenue", type: "Scheduled", runs: "365", status: "Active" },
    { report: "User Analytics", type: "Real-time", runs: "12K", status: "Active" },
    { report: "Sales Pipeline", type: "On-demand", runs: "1,234", status: "Active" },
    { report: "Performance Metrics", type: "Scheduled", runs: "180", status: "Active" },
    { report: "Custom Report", type: "On-demand", runs: "456", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Analytics Manager" subtitle="Analytics operations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
