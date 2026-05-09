import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/engineering-manager")({
  head: () => ({ meta: [{ title: "Engineering Manager — SaaS Vala" }, { name: "description", content: "Engineering team management" }] }),
  component: Page,
});

function Page() {
  const { data: engData, isLoading, error } = useQuery({
    queryKey: ["engineering-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Engineering Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Engineering Manager" subtitle="Engineering team management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Engineering Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Team Size", value: "45", delta: "+3", up: true },
    { label: "Active Sprints", value: "4", delta: "—", up: true },
    { label: "Velocity", value: "42 pts/sprint", delta: "+5", up: true },
    { label: "Open PRs", value: "23", delta: "-8", up: true },
  ];

  const columns = [
    { key: "developer", label: "Developer" },
    { key: "tasks", label: "Tasks" },
    { key: "velocity", label: "Velocity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { developer: "John Smith", tasks: "8", velocity: "12", status: "Active" },
    { developer: "Sarah Johnson", tasks: "6", velocity: "10", status: "Active" },
    { developer: "Mike Brown", tasks: "7", velocity: "9", status: "Active" },
    { developer: "Emily Davis", tasks: "5", velocity: "8", status: "On Leave" },
    { developer: "Alex Wilson", tasks: "9", velocity: "11", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Engineering Manager" subtitle="Engineering team management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
