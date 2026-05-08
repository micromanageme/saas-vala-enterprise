import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/audio-engineer")({
  head: () => ({ meta: [{ title: "Audio Engineer — SaaS Vala" }, { name: "description", content: "Audio engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: audioData, isLoading, error } = useQuery({
    queryKey: ["audio-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Audio Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Audio Engineer" subtitle="Audio engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Audio Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Sessions Recorded", value: "45", delta: "+5", up: true },
    { label: "Hours Mixed", value: "250", delta: "+30", up: true },
    { label: "Projects Completed", value: "35", delta: "+4", up: true },
    { label: "Quality Rating", value: "4.8/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "project", label: "Audio Project" },
    { key: "type", label: "Type" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "PROJ-001", type: "Podcast", duration: "45min", status: "In Progress" },
    { project: "PROJ-002", type: "Music", duration: "3:30", status: "Mixed" },
    { project: "PROJ-003", type: "Commercial", duration: "30s", status: "Mastered" },
    { project: "PROJ-004", type: "Audiobook", duration: "6h", status: "Recording" },
    { project: "PROJ-005", type: "Interview", duration: "1h", status: "Editing" },
  ];

  return (
    <AppShell>
      <ModulePage title="Audio Engineer" subtitle="Audio engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
