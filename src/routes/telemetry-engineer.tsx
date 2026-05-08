import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/telemetry-engineer")({
  head: () => ({ meta: [{ title: "Telemetry Engineer — SaaS Vala" }, { name: "description", content: "Telemetry engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: telemetryData, isLoading, error } = useQuery({
    queryKey: ["telemetry-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Telemetry Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Telemetry Engineer" subtitle="Telemetry engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Telemetry Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Metrics Points/Min", value: "2.5M", delta: "+0.5M", up: true },
    { label: "Dashboards", value: "45", delta: "+5", up: true },
    { label: "Alerts Configured", value: "123", delta: "+12", up: true },
    { label: "Data Freshness", value: "99.8%", delta: "+0.2%", up: true },
  ];

  const columns = [
    { key: "namespace", label: "Namespace" },
    { key: "metrics", label: "Metrics" },
    { key: "retention", label: "Retention" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { namespace: "application", metrics: "1.2M", retention: "15 days", status: "Active" },
    { namespace: "infrastructure", metrics: "800K", retention: "30 days", status: "Active" },
    { namespace: "business", metrics: "300K", retention: "90 days", status: "Active" },
    { namespace: "security", metrics: "150K", retention: "180 days", status: "Active" },
    { namespace: "custom", metrics: "50K", retention: "30 days", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Telemetry Engineer" subtitle="Telemetry engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
