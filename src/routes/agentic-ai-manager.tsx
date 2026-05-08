import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/agentic-ai-manager")({
  head: () => ({ meta: [{ title: "Agentic AI Manager — SaaS Vala" }, { name: "description", content: "Agentic AI management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: agenticData, isLoading, error } = useQuery({
    queryKey: ["agentic-ai-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Agentic AI Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Agentic AI Manager" subtitle="Agentic AI management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Agentic AI Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Agents", value: "45", delta: "+5", up: true },
    { label: "Agent Success Rate", value: "92%", delta: "+3%", up: true },
    { label: "Tasks Completed", value: "12.5K", delta: "+2K", up: true },
    { label: "Avg Task Time", value: "2.5min", delta: "-0.5min", up: true },
  ];

  const columns = [
    { key: "agent", label: "AI Agent" },
    { key: "type", label: "Type" },
    { key: "tasks", label: "Tasks/Day" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { agent: "Customer Support Agent", type: "Chat", tasks: "2.5K", status: "Active" },
    { agent: "Data Analysis Agent", type: "Analytics", tasks: "1.8K", status: "Active" },
    { agent: "Content Generation Agent", type: "Creative", tasks: "1.2K", status: "Active" },
    { agent: "Code Review Agent", type: "Dev", tasks: "800", status: "Active" },
    { agent: "Sales Agent", type: "Sales", tasks: "1.5K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Agentic AI Manager" subtitle="Agentic AI management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
