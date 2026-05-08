import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/construction-manager")({
  head: () => ({ meta: [{ title: "Construction Manager — SaaS Vala" }, { name: "description", content: "Construction management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: constructionData, isLoading, error } = useQuery({
    queryKey: ["construction-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Construction Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Construction Manager" subtitle="Construction management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Construction Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Projects", value: "12", delta: "+2", up: true },
    { label: "On-Time Delivery", value: "88%", delta: "+3%", up: true },
    { label: "Budget Adherence", value: "94%", delta: "+2%", up: true },
    { label: "Safety Score", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "project", label: "Construction Project" },
    { key: "type", label: "Type" },
    { key: "progress", label: "Progress" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "PROJ-001", type: "Commercial", progress: "75%", status: "On Track" },
    { project: "PROJ-002", type: "Residential", progress: "60%", status: "On Track" },
    { project: "PROJ-003", type: "Infrastructure", progress: "90%", status: "On Track" },
    { project: "PROJ-004", type: "Industrial", progress: "45%", status: "Delayed" },
    { project: "PROJ-005", type: "Commercial", progress: "30%", status: "Planning" },
  ];

  return (
    <AppShell>
      <ModulePage title="Construction Manager" subtitle="Construction management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
