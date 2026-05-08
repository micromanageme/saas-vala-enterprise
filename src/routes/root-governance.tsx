import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-governance")({
  head: () => ({ meta: [{ title: "System Governance — Universal Access Admin" }, { name: "description", content: "Root-level policies and compliance" }] }),
  component: Page,
});

function Page() {
  const { data: governanceData, isLoading, error } = useQuery({
    queryKey: ["root-governance"],
    queryFn: async () => {
      const response = await fetch("/api/admin/monitoring", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch governance data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="System Governance" subtitle="Root-level policies and compliance" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load System Governance data</div>
      </AppShell>
    );
  }

  const monitoring = governanceData?.monitoring;

  const kpis = monitoring ? [
    { label: "Total Users", value: monitoring.users.total.toString(), delta: "—", up: true },
    { label: "Active Users", value: monitoring.users.active.toString(), delta: "—", up: true },
    { label: "Active Sessions", value: monitoring.sessions.active.toString(), delta: "—", up: true },
    { label: "Total Transactions", value: monitoring.transactions.total.toString(), delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  const rows = monitoring ? [
    { metric: "Total Users", value: monitoring.users.total.toString(), status: "ACTIVE" },
    { metric: "Active Users", value: monitoring.users.active.toString(), status: "ACTIVE" },
    { metric: "Suspended Users", value: monitoring.users.suspended.toString(), status: "MONITORING" },
    { metric: "Active Sessions", value: monitoring.sessions.active.toString(), status: "ACTIVE" },
    { metric: "Active Licenses", value: monitoring.licenses.active.toString(), status: "ACTIVE" },
    { metric: "Total Products", value: monitoring.products.total.toString(), status: "ACTIVE" },
  ] : [];

  return (
    <AppShell>
      <ModulePage title="System Governance" subtitle="Root-level policies and compliance" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
