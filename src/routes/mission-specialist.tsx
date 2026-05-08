import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/mission-specialist")({
  head: () => ({ meta: [{ title: "Mission Specialist — SaaS Vala" }, { name: "description", content: "Mission specialist workspace" }] }),
  component: Page,
});

function Page() {
  const { data: missionData, isLoading, error } = useQuery({
    queryKey: ["mission-specialist-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Mission Specialist data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Mission Specialist" subtitle="Mission specialist workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Mission Specialist data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Missions Participated", value: "12", delta: "+1", up: true },
    { label: "EVA Hours", value: "45", delta: "+5", up: true },
    { label: "Experiments Conducted", value: "85", delta: "+8", up: true },
    { label: "Training Hours", value: "250", delta: "+30", up: true },
  ];

  const columns = [
    { key: "experiment", label: "Space Experiment" },
    { key: "type", label: "Type" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { experiment: "EXP-001", type: "Biology", duration: "30 days", status: "Completed" },
    { experiment: "EXP-002", type: "Physics", duration: "60 days", status: "Active" },
    { experiment: "EXP-003", type: "Materials", duration: "45 days", status: "In Progress" },
    { experiment: "EXP-004", type: "Technology", duration: "90 days", status: "Planning" },
    { experiment: "EXP-005", type: "Earth Observation", duration: "15 days", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Mission Specialist" subtitle="Mission specialist workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
