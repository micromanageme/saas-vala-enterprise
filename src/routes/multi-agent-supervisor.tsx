import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/multi-agent-supervisor")({
  head: () => ({ meta: [{ title: "Multi Agent Supervisor — SaaS Vala" }, { name: "description", content: "Multi-agent supervision workspace" }] }),
  component: Page,
});

function Page() {
  const { data: multiAgentData, isLoading, error } = useQuery({
    queryKey: ["multi-agent-supervisor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Multi Agent Supervisor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Multi Agent Supervisor" subtitle="Multi-agent supervision workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Multi Agent Supervisor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Agent Swarms", value: "8", delta: "+1", up: true },
    { label: "Coordination Rate", value: "95%", delta: "+2%", up: true },
    { label: "Collaborative Tasks", value: "3.2K", delta: "+500", up: true },
    { label: "Conflicts Resolved", value: "45", delta: "+8", up: true },
  ];

  const columns = [
    { key: "swarm", label: "Agent Swarm" },
    { key: "agents", label: "Agents" },
    { key: "objective", label: "Objective" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { swarm: "Customer Service Swarm", agents: "12", objective: "Support", status: "Active" },
    { swarm: "Data Processing Swarm", agents: "8", objective: "Analytics", status: "Active" },
    { swarm: "Content Creation Swarm", agents: "6", objective: "Marketing", status: "Active" },
    { swarm: "Code Generation Swarm", agents: "5", objective: "Development", status: "Active" },
    { swarm: "Research Swarm", agents: "4", objective: "R&D", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Multi Agent Supervisor" subtitle="Multi-agent supervision workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
