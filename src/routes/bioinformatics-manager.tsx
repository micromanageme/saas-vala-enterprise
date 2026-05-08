import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/bioinformatics-manager")({
  head: () => ({ meta: [{ title: "Bioinformatics Manager — SaaS Vala" }, { name: "description", content: "Bioinformatics management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: bioData, isLoading, error } = useQuery({
    queryKey: ["bioinformatics-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Bioinformatics Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Bioinformatics Manager" subtitle="Bioinformatics management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Bioinformatics Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Sequences Analyzed", value: "50K", delta: "+5K", up: true },
    { label: "Data Processed", value: "2.5TB", delta: "+500GB", up: true },
    { label: "Pipeline Success", value: "96%", delta: "+2%", up: true },
    { label: "Computing Power", value: "85%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "project", label: "Analysis Project" },
    { key: "type", label: "Type" },
    { key: "samples", label: "Samples" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "BIO-001", type: "Genomics", samples: "500", status: "In Progress" },
    { project: "BIO-002", type: "Proteomics", samples: "300", status: "Completed" },
    { project: "BIO-003", type: "Transcriptomics", samples: "400", status: "In Progress" },
    { project: "BIO-004", type: "Metagenomics", samples: "200", status: "Pending" },
    { project: "BIO-005", type: "Epigenomics", samples: "350", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Bioinformatics Manager" subtitle="Bioinformatics management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
