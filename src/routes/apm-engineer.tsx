import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/apm-engineer")({
  head: () => ({ meta: [{ title: "APM Engineer — SaaS Vala" }, { name: "description", content: "APM engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: apmData, isLoading, error } = useQuery({
    queryKey: ["apm-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch APM Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="APM Engineer" subtitle="APM engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load APM Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Apps Monitored", value: "23", delta: "+3", up: true },
    { label: "Apdex Score", value: "0.95", delta: "+0.03", up: true },
    { label: "Transaction Rate", value: "5.2K/s", delta: "+0.8K/s", up: true },
    { label: "Response Time", value: "180ms", delta: "-20ms", up: true },
  ];

  const columns = [
    { key: "application", label: "Application" },
    { key: "responseTime", label: "Response Time" },
    { key: "errorRate", label: "Error Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { application: "Web Portal", responseTime: "120ms", errorRate: "0.5%", status: "Healthy" },
    { application: "Mobile App", responseTime: "250ms", errorRate: "0.8%", status: "Healthy" },
    { application: "API Gateway", responseTime: "45ms", errorRate: "0.2%", status: "Healthy" },
    { application: "Admin Panel", responseTime: "180ms", errorRate: "1.2%", status: "Degraded" },
    { application: "Partner Portal", responseTime: "200ms", errorRate: "0.6%", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="APM Engineer" subtitle="APM engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
