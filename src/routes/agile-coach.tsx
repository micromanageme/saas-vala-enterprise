import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/agile-coach")({
  head: () => ({ meta: [{ title: "Agile Coach — SaaS Vala" }, { name: "description", content: "Agile coaching workspace" }] }),
  component: Page,
});

function Page() {
  const { data: agileData, isLoading, error } = useQuery({
    queryKey: ["agile-coach-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Agile Coach data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Agile Coach" subtitle="Agile coaching workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Agile Coach data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Teams Coached", value: "5", delta: "+1", up: true },
    { label: "Agile Maturity", value: "4.2/5", delta: "+0.3", up: true },
    { label: "Training Sessions", value: "12", delta: "+3", up: true },
    { label: "Process Improvements", value: "8", delta: "+2", up: true },
  ];

  const columns = [
    { key: "team", label: "Team" },
    { key: "maturity", label: "Maturity" },
    { key: "framework", label: "Framework" },
    { key: "focus", label: "Focus Area" },
  ];

  const rows = [
    { team: "Engineering Team A", maturity: "4.5/5", framework: "Scrum", focus: "Velocity" },
    { team: "Engineering Team B", maturity: "4.0/5", framework: "Kanban", focus: "Flow" },
    { team: "Product Team", maturity: "3.8/5", framework: "Scrum", focus: "Backlog" },
    { team: "Design Team", maturity: "4.2/5", framework: "Kanban", focus: "Delivery" },
    { team: "QA Team", maturity: "4.0/5", framework: "Scrum", focus: "Quality" },
  ];

  return (
    <AppShell>
      <ModulePage title="Agile Coach" subtitle="Agile coaching workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
