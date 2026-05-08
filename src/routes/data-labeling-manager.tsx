import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/data-labeling-manager")({
  head: () => ({ meta: [{ title: "Data Labeling Manager — SaaS Vala" }, { name: "description", content: "Data labeling management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: labelingData, isLoading, error } = useQuery({
    queryKey: ["data-labeling-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Data Labeling Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Data Labeling Manager" subtitle="Data labeling management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Data Labeling Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Labels Created", value: "250K", delta: "+25K", up: true },
    { label: "Accuracy", value: "96%", delta: "+1%", up: true },
    { label: "Labelers Active", value: "25", delta: "+3", up: true },
    { label: "Throughput", value: "10K/day", delta: "+1K", up: true },
  ];

  const columns = [
    { key: "project", label: "Labeling Project" },
    { key: "type", label: "Type" },
    { key: "progress", label: "Progress" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "LBL-001", type: "Image Classification", progress: "75%", status: "In Progress" },
    { project: "LBL-002", type: "Text Annotation", progress: "90%", status: "In Progress" },
    { project: "LBL-003", type: "Bounding Box", progress: "60%", status: "In Progress" },
    { project: "LBL-004", type: "Segmentation", progress: "45%", status: "In Progress" },
    { project: "LBL-005", type: "Sentiment", progress: "100%", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Data Labeling Manager" subtitle="Data labeling management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
