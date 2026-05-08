import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/research-data-engineer")({
  head: () => ({ meta: [{ title: "Research Data Engineer — SaaS Vala" }, { name: "description", content: "Research data engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: dataData, isLoading, error } = useQuery({
    queryKey: ["research-data-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Research Data Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Research Data Engineer" subtitle="Research data engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Research Data Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Data Pipelines", value: "25", delta: "+3", up: true },
    { label: "Data Processed", value: "5TB", delta: "+500GB", up: true },
    { label: "Pipeline Success", value: "98%", delta: "+1%", up: true },
    { label: "Storage Used", value: "2.5TB", delta: "+200GB", up: true },
  ];

  const columns = [
    { key: "pipeline", label: "Data Pipeline" },
    { key: "source", label: "Source" },
    { key: "volume", label: "Daily Volume" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { pipeline: "PIPE-001", source: "Sequencer", volume: "100GB", status: "Active" },
    { pipeline: "PIPE-002", source: "LIMS", volume: "50GB", status: "Active" },
    { pipeline: "PIPE-003", source: "Clinical", volume: "75GB", status: "Active" },
    { pipeline: "PIPE-004", source: "External", volume: "25GB", status: "In Development" },
    { pipeline: "PIPE-005", source: "Archive", volume: "30GB", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Research Data Engineer" subtitle="Research data engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
