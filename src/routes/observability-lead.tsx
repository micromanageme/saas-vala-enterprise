import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/observability-lead")({
  head: () => ({ meta: [{ title: "Observability Lead — SaaS Vala" }, { name: "description", content: "Observability leadership" }] }),
  component: Page,
});

function Page() {
  const { data: obsLeadData, isLoading, error } = useQuery({
    queryKey: ["observability-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Observability Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Observability Lead" subtitle="Observability leadership" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Observability Lead data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Services Monitored", value: "45", delta: "+5", up: true },
    { label: "Observability Coverage", value: "92%", delta: "+3%", up: true },
    { label: "Alert Accuracy", value: "95%", delta: "+2%", up: true },
    { label: "MTTD", value: "5min", delta: "-2min", up: true },
  ];

  const columns = [
    { key: "platform", label: "Observability Platform" },
    { key: "coverage", label: "Coverage" },
    { key: "health", label: "Health" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { platform: "Tracing", coverage: "95%", health: "Healthy", status: "Active" },
    { platform: "Logging", coverage: "98%", health: "Healthy", status: "Active" },
    { platform: "Metrics", coverage: "92%", health: "Healthy", status: "Active" },
    { platform: "APM", coverage: "88%", health: "Healthy", status: "Active" },
    { platform: "RUM", coverage: "85%", health: "Healthy", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Observability Lead" subtitle="Observability leadership" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
