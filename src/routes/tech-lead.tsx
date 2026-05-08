import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/tech-lead")({
  head: () => ({ meta: [{ title: "Tech Lead — SaaS Vala" }, { name: "description", content: "Technical leadership" }] }),
  component: Page,
});

function Page() {
  const { data: techLeadData, isLoading, error } = useQuery({
    queryKey: ["tech-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Tech Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Tech Lead" subtitle="Technical leadership" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Tech Lead data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Team Size", value: "12", delta: "+2", up: true },
    { label: "PRs Reviewed", value: "45", delta: "+8", up: true },
    { label: "Sprint Velocity", value: "92%", delta: "+3%", up: true },
    { label: "Code Quality", value: "95%", delta: "+2%", up: true },
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
      <ModulePage title="Tech Lead" subtitle="Technical leadership" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
