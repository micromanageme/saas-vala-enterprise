import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/observability-engineer")({
  head: () => ({ meta: [{ title: "Observability Engineer — SaaS Vala" }, { name: "description", content: "System observability and monitoring" }] }),
  component: Page,
});

function Page() {
  const { data: obsData, isLoading, error } = useQuery({
    queryKey: ["observability-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Observability Engineer data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Observability Engineer" subtitle="System observability and monitoring" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Observability Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Metrics/Minute", value: "2.5M", delta: "+0.5M", up: true },
    { label: "Alerts Active", value: "3", delta: "-2", up: true },
    { label: "Dashboard Health", value: "100%", delta: "—", up: true },
    { label: "Data Retention", value: "30 days", delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "service", label: "Service" },
    { key: "status", label: "Status" },
    { key: "alerts", label: "Alerts" },
    { key: "uptime", label: "Uptime" },
  ];

  const rows = [
    { service: "Prometheus", status: "Healthy", alerts: "0", uptime: "99.99%" },
    { service: "Grafana", status: "Healthy", alerts: "0", uptime: "99.95%" },
    { service: "ELK Stack", status: "Healthy", alerts: "1", uptime: "99.98%" },
    { service: "Jaeger", status: "Healthy", alerts: "0", uptime: "99.92%" },
    { service: "AlertManager", status: "Healthy", alerts: "2", uptime: "99.99%" },
  ];

  return (
    <AppShell>
      <ModulePage title="Observability Engineer" subtitle="System observability and monitoring" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
