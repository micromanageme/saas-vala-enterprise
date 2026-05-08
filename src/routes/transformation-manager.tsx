import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/transformation-manager")({
  head: () => ({ meta: [{ title: "Transformation Manager — SaaS Vala" }, { name: "description", content: "Transformation management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: transformData, isLoading, error } = useQuery({
    queryKey: ["transformation-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Transformation Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Transformation Manager" subtitle="Transformation management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Transformation Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Transformation Programs", value: "5", delta: "+1", up: true },
    { label: "Completion Rate", value: "78%", delta: "+8%", up: true },
    { label: "Adoption Rate", value: "85%", delta: "+5%", up: true },
    { label: "ROI", value: "150%", delta: "+20%", up: true },
  ];

  const columns = [
    { key: "program", label: "Transformation Program" },
    { key: "phase", label: "Phase" },
    { key: "adoption", label: "Adoption" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { program: "Cloud Migration", phase: "Execution", adoption: "90%", status: "On Track" },
    { program: "Agile Transformation", phase: "Rollout", adoption: "85%", status: "On Track" },
    { program: "Data Modernization", phase: "Planning", adoption: "60%", status: "In Progress" },
    { program: "Process Automation", phase: "Execution", adoption: "80%", status: "On Track" },
    { program: "Culture Shift", phase: "Foundation", adoption: "75%", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Transformation Manager" subtitle="Transformation management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
