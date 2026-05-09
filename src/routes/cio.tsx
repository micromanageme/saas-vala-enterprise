import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/cio")({
  head: () => ({ meta: [{ title: "CIO Dashboard — SaaS Vala" }, { name: "description", content: "Chief Information Officer - IT oversight" }] }),
  component: Page,
});

function Page() {
  const { data: cioData, isLoading, error } = useQuery({
    queryKey: ["cio-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch CIO data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="CIO Dashboard" subtitle="Chief Information Officer - IT oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load CIO data</div>
      </AppShell>
    );
  }

  const data = cioData?.data;
  const kpis = data?.systemHealth ? [
    { label: "System Health", value: data.systemHealth.status, delta: "—", up: data.systemHealth.status === 'HEALTHY' },
    { label: "Active Sessions", value: data.kpis?.activeSessions?.toLocaleString() || "0", delta: "—", up: true },
    { label: "IT Tickets", value: "23", delta: "-5", up: true },
    { label: "SLA Compliance", value: "98.5%", delta: "+0.5%", up: true },
  ];

  const columns = [
    { key: "system", label: "System" },
    { key: "status", label: "Status" },
    { key: "uptime", label: "Uptime" },
    { key: "performance", label: "Performance" },
  ];

  const rows = [
    { system: "Core Platform", status: "Healthy", uptime: "99.99%", performance: "Excellent" },
    { system: "Database Cluster", status: "Healthy", uptime: "99.98%", performance: "Good" },
    { system: "CDN Network", status: "Healthy", uptime: "99.99%", performance: "Excellent" },
    { system: "Backup Systems", status: "Healthy", uptime: "100%", performance: "Good" },
    { system: "Monitoring Stack", status: "Healthy", uptime: "99.95%", performance: "Excellent" },
  ];

  return (
    <AppShell>
      <ModulePage title="CIO Dashboard" subtitle="Chief Information Officer - IT oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
