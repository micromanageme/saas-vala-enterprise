import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/synthetic-data-engineer")({
  head: () => ({ meta: [{ title: "Synthetic Data Engineer — SaaS Vala" }, { name: "description", content: "Synthetic data engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: syntheticData, isLoading, error } = useQuery({
    queryKey: ["synthetic-data-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Synthetic Data Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Synthetic Data Engineer" subtitle="Synthetic data engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Synthetic Data Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Datasets Generated", value: "45", delta: "+5", up: true },
    { label: "Rows Generated", value: "5M", delta: "+500K", up: true },
    { label: "Fidelity Score", value: "94%", delta: "+2%", up: true },
    { label: "Privacy Score", value: "100%", delta: "—", up: true },
  ];

  const columns = [
    { key: "dataset", label: "Synthetic Dataset" },
    { key: "type", label: "Type" },
    { key: "rows", label: "Rows" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { dataset: "SD-001", type: "Tabular", rows: "1M", status: "Ready" },
    { dataset: "SD-002", type: "Time Series", rows: "500K", status: "Ready" },
    { dataset: "SD-003", type: "Text", rows: "2M", status: "Generating" },
    { dataset: "SD-004", type: "Image", rows: "100K", status: "Ready" },
    { dataset: "SD-005", type: "Tabular", rows: "1.5M", status: "Ready" },
  ];

  return (
    <AppShell>
      <ModulePage title="Synthetic Data Engineer" subtitle="Synthetic data engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
