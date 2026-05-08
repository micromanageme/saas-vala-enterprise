import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/trace-analyst")({
  head: () => ({ meta: [{ title: "Trace Analyst — SaaS Vala" }, { name: "description", content: "Distributed tracing analysis" }] }),
  component: Page,
});

function Page() {
  const { data: traceData, isLoading, error } = useQuery({
    queryKey: ["trace-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Trace Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Trace Analyst" subtitle="Distributed tracing analysis" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Trace Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Traces/Day", value: "2.5M", delta: "+0.5M", up: true },
    { label: "Avg Latency", value: "120ms", delta: "-15ms", up: true },
    { label: "Error Rate", value: "0.8%", delta: "-0.2%", up: true },
    { label: "Services Traced", value: "42", delta: "+3", up: true },
  ];

  const columns = [
    { key: "service", label: "Service" },
    { key: "latency", label: "Avg Latency" },
    { key: "errorRate", label: "Error Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { service: "API Gateway", latency: "45ms", errorRate: "0.2%", status: "Healthy" },
    { service: "Auth Service", latency: "80ms", errorRate: "0.5%", status: "Healthy" },
    { service: "User Service", latency: "120ms", errorRate: "0.8%", status: "Healthy" },
    { service: "Order Service", latency: "200ms", errorRate: "1.2%", status: "Degraded" },
    { service: "Payment Service", latency: "350ms", errorRate: "0.3%", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Trace Analyst" subtitle="Distributed tracing analysis" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
