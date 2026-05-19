import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — SaaS Vala" }, { name: "description", content: "Tasks, sprints & gantt" }] }),
  component: Page,
});

function Page() {
  const { data: projectsData, isLoading, error, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects?type=all");
      if (!response.ok) throw new Error("Failed to fetch Projects data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Projects" subtitle="Tasks, sprints & gantt" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Projects"
          subtitle="Tasks, sprints & gantt"
          message="We couldn't load Projects data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = projectsData?.data;
  const kpis = data?.kpis ? [
    { label: "Active", value: data.kpis.active.toString(), delta: `+${data.kpis.activeDelta}`, up: data.kpis.activeDelta > 0 },
    { label: "Open Tasks", value: data.kpis.openTasks.toString(), delta: `+${data.kpis.openTasksDelta}`, up: data.kpis.openTasksDelta > 0 },
    { label: "Sprints", value: data.kpis.sprints.toString(), delta: `+${data.kpis.sprintsDelta}`, up: data.kpis.sprintsDelta > 0 },
    { label: "Bugs", value: data.kpis.bugs.toString(), delta: `${data.kpis.bugsDelta}`, up: data.kpis.bugsDelta < 0 }
  ] : [];

  const columns = [{ key: "name", label: "Project" }, { key: "lead", label: "Lead" }, { key: "progress", label: "Progress" }, { key: "status", label: "Status" }];
  const rows = data?.projects?.map((p: any) => ({
    name: p.name,
    lead: p.lead,
    progress: `${p.progress}%`,
    status: p.status
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Projects" subtitle="Tasks, sprints & gantt" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
