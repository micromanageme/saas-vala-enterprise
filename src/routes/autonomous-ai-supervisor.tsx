import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/autonomous-ai-supervisor")({
  head: () => ({ meta: [{ title: "Autonomous AI Supervisor — SaaS Vala" }, { name: "description", content: "Autonomous AI supervision workspace" }] }),
  component: Page,
});

function Page() {
  const { data: autonomousData, isLoading, error } = useQuery({
    queryKey: ["autonomous-ai-supervisor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Autonomous AI Supervisor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Autonomous AI Supervisor" subtitle="Autonomous AI supervision workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Autonomous AI Supervisor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Agents Active", value: "45", delta: "+5", up: true },
    { label: "Tasks Completed", value: "1.2K", delta: "+150", up: true },
    { label: "Success Rate", value: "94%", delta: "+2%", up: true },
    { label: "Human Override", value: "5%", delta: "-2%", up: true },
  ];

  const columns = [
    { key: "agent", label: "Autonomous Agent" },
    { key: "type", label: "Type" },
    { key: "tasks", label: "Tasks/Day" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { agent: "AGENT-001", type: "Decision", tasks: "50", status: "Active" },
    { agent: "AGENT-002", type: "Planning", tasks: "35", status: "Active" },
    { agent: "AGENT-003", type: "Execution", tasks: "40", status: "Active" },
    { agent: "AGENT-004", type: "Monitoring", tasks: "30", status: "Standby" },
    { agent: "AGENT-005", type: "Learning", tasks: "25", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Autonomous AI Supervisor" subtitle="Autonomous AI supervision workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
