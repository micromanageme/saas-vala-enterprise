import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/workflow-orchestrator")({
  head: () => ({ meta: [{ title: "Workflow Orchestrator — SaaS Vala" }, { name: "description", content: "Workflow orchestration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: workflowData, isLoading, error } = useQuery({
    queryKey: ["workflow-orchestrator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Workflow Orchestrator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Workflow Orchestrator" subtitle="Workflow orchestration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Workflow Orchestrator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Workflows", value: "23", delta: "+3", up: true },
    { label: "Executions/Day", value: "45.2K", delta: "+8K", up: true },
    { label: "Success Rate", value: "98.5%", delta: "+0.5%", up: true },
    { label: "Avg Duration", value: "2.5min", delta: "-0.3min", up: true },
  ];

  const columns = [
    { key: "workflow", label: "Workflow" },
    { key: "triggers", label: "Triggers" },
    { key: "successRate", label: "Success Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { workflow: "User Onboarding", triggers: "Event", successRate: "99%", status: "Active" },
    { workflow: "Order Processing", triggers: "Event", successRate: "98%", status: "Active" },
    { workflow: "Payment Settlement", triggers: "Schedule", successRate: "99%", status: "Active" },
    { workflow: "Data Sync", triggers: "Schedule", successRate: "97%", status: "Active" },
    { workflow: "Report Generation", triggers: "Schedule", successRate: "100%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Workflow Orchestrator" subtitle="Workflow orchestration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
