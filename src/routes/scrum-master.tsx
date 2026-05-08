import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/scrum-master")({
  head: () => ({ meta: [{ title: "Scrum Master — SaaS Vala" }, { name: "description", content: "Scrum Master workspace" }] }),
  component: Page,
});

function Page() {
  const { data: scrumData, isLoading, error } = useQuery({
    queryKey: ["scrum-master-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Scrum Master data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Scrum Master" subtitle="Scrum Master workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Scrum Master data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Sprint Progress", value: "75%", delta: "+15%", up: true },
    { label: "Story Points Done", value: "45", delta: "+12", up: true },
    { label: "Velocity", value: "38", delta: "+5", up: true },
    { label: "Blockers", value: "2", delta: "-1", up: true },
  ];

  const columns = [
    { key: "story", label: "Story" },
    { key: "points", label: "Points" },
    { key: "assignee", label: "Assignee" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { story: "User Authentication", points: "5", assignee: "John Smith", status: "Done" },
    { story: "Dashboard Redesign", points: "8", assignee: "Sarah Johnson", status: "In Progress" },
    { story: "API Integration", points: "3", assignee: "Mike Brown", status: "In Progress" },
    { story: "Mobile Responsive", points: "5", assignee: "Emily Davis", status: "To Do" },
    { story: "Performance Optimization", points: "8", assignee: "Alex Wilson", status: "Blocked" },
  ];

  return (
    <AppShell>
      <ModulePage title="Scrum Master" subtitle="Scrum Master workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
