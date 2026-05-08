import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/annotation-specialist")({
  head: () => ({ meta: [{ title: "Annotation Specialist — SaaS Vala" }, { name: "description", content: "Annotation specialist workspace" }] }),
  component: Page,
});

function Page() {
  const { data: annotationData, isLoading, error } = useQuery({
    queryKey: ["annotation-specialist-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Annotation Specialist data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Annotation Specialist" subtitle="Annotation specialist workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Annotation Specialist data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Annotations Today", value: "500", delta: "+50", up: true },
    { label: "Accuracy", value: "98%", delta: "+1%", up: true },
    { label: "Review Rate", value: "95%", delta: "+2%", up: true },
    { label: "Quality Score", label: "4.8/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "task", label: "Annotation Task" },
    { key: "type", label: "Type" },
    { key: "items", label: "Items" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { task: "ANN-001", type: "Bounding Box", items: "150", status: "Completed" },
    { task: "ANN-002", type: "Polygon", items: "100", status: "In Progress" },
    { task: "ANN-003", type: "Keypoint", items: "75", status: "In Progress" },
    { task: "ANN-004", type: "Segmentation", items: "120", status: "Pending" },
    { task: "ANN-005", type: "Classification", items: "200", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Annotation Specialist" subtitle="Annotation specialist workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
