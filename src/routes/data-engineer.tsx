import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/data-engineer")({
  head: () => ({ meta: [{ title: "Data Engineer — SaaS Vala" }, { name: "description", content: "Data engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: dataEngData, isLoading, error } = useQuery({
    queryKey: ["data-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Data Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Data Engineer" subtitle="Data engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Data Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Pipelines Active", value: "12", delta: "+2", up: true },
    { label: "Data Volume/Day", value: "2.5TB", delta: "+0.5TB", up: true },
    { label: "Pipeline Success", value: "98.5%", delta: "+0.5%", up: true },
    { label: "ETL Jobs", value: "45", delta: "+5", up: true },
  ];

  const columns = [
    { key: "pipeline", label: "Pipeline" },
    { key: "source", label: "Source" },
    { key: "frequency", label: "Frequency" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { pipeline: "Customer Data Sync", source: "CRM", frequency: "Hourly", status: "Running" },
    { pipeline: "Sales Data Import", source: "ERP", frequency: "Daily", status: "Running" },
    { pipeline: "Web Analytics", source: "Google Analytics", frequency: "Real-time", status: "Running" },
    { pipeline: "Inventory Update", source: "Warehouse", frequency: "Hourly", status: "Running" },
    { pipeline: "Financial Data", source: "Accounting", frequency: "Daily", status: "Running" },
  ];

  return (
    <AppShell>
      <ModulePage title="Data Engineer" subtitle="Data engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
