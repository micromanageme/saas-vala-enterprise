import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/resilience-engineer")({
  head: () => ({ meta: [{ title: "Resilience Engineer — SaaS Vala" }, { name: "description", content: "Resilience engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: resilienceData, isLoading, error } = useQuery({
    queryKey: ["resilience-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Resilience Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Resilience Engineer" subtitle="Resilience engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Resilience Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Recovery Time", value: "2.5min", delta: "-0.5min", up: true },
    { label: "System Resilience", value: "94%", delta: "+3%", up: true },
    { label: "Auto-Recovery", value: "88%", delta: "+5%", up: true },
    { label: "Circuit Breakers", value: "12", delta: "+2", up: true },
  ];

  const columns = [
    { key: "pattern", label: "Resilience Pattern" },
    { key: "implementation", label: "Implementation" },
    { key: "effectiveness", label: "Effectiveness" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { pattern: "Circuit Breaker", implementation: "API Gateway", effectiveness: "95%", status: "Active" },
    { pattern: "Retry with Backoff", implementation: "Database", effectiveness: "92%", status: "Active" },
    { pattern: "Bulkhead", implementation: "Microservices", effectiveness: "88%", status: "Active" },
    { pattern: "Timeout", implementation: "External APIs", effectiveness: "90%", status: "Active" },
    { pattern: "Fallback", implementation: "Cache", effectiveness: "85%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Resilience Engineer" subtitle="Resilience engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
