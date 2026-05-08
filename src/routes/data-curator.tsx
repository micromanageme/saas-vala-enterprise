import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/data-curator")({
  head: () => ({ meta: [{ title: "Data Curator — SaaS Vala" }, { name: "description", content: "Data curation workspace" }] }),
  component: Page,
});

function Page() {
  const { data: curatorData, isLoading, error } = useQuery({
    queryKey: ["data-curator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Data Curator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Data Curator" subtitle="Data curation workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Data Curator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Datasets Curated", value: "450", delta: "+50", up: true },
    { label: "Data Records", value: "2.8M", delta: "+300K", up: true },
    { label: "Quality Score", value: "96%", delta: "+1%", up: true },
    { label: "Access Requests", value: "125", delta: "+15", up: true },
  ];

  const columns = [
    { key: "dataset", label: "Dataset" },
    { key: "records", label: "Records" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { dataset: "DS-2024-001", records: "125K", category: "Healthcare", status: "Published" },
    { dataset: "DS-2024-002", records: "250K", category: "Finance", status: "In Review" },
    { dataset: "DS-2024-003", records: "180K", category: "Education", status: "Active" },
    { dataset: "DS-2024-004", records: "95K", category: "Research", status: "Pending" },
    { dataset: "DS-2024-005", records: "320K", category: "Public", status: "Published" },
  ];

  return (
    <AppShell>
      <ModulePage title="Data Curator" subtitle="Data curation workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
