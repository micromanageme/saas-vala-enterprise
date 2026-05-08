import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/site-reliability-engineer")({
  head: () => ({ meta: [{ title: "Site Reliability Engineer — SaaS Vala" }, { name: "description", content: "SRE workspace" }] }),
  component: Page,
});

function Page() {
  const { data: sreData, isLoading, error } = useQuery({
    queryKey: ["site-reliability-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Site Reliability Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Site Reliability Engineer" subtitle="SRE workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Site Reliability Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "SLA Compliance", value: "99.95%", delta: "+0.02%", up: true },
    { label: "SLO Health", value: "98.5%", delta: "+0.5%", up: true },
    { label: "Error Budget", value: "12.5min", delta: "+5min", up: true },
    { label: "Incidents", value: "3", delta: "-1", up: true },
  ];

  const columns = [
    { key: "service", label: "Service" },
    { key: "slo", label: "SLO Target" },
    { key: "current", label: "Current" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { service: "API Gateway", slo: "99.9%", current: "99.95%", status: "Healthy" },
    { service: "User Service", slo: "99.5%", current: "99.8%", status: "Healthy" },
    { service: "Payment Service", slo: "99.99%", current: "99.97%", status: "Healthy" },
    { service: "Notification Service", slo: "99.5%", current: "99.3%", status: "Warning" },
    { service: "Analytics Service", slo: "99.0%", current: "99.2%", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Site Reliability Engineer" subtitle="SRE workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
