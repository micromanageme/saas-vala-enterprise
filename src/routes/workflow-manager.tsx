import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/workflow-manager")({
  head: () => ({ meta: [{ title: "Workflow Manager — SaaS Vala" }, { name: "description", content: "Workflow management" }] }),
  component: Page,
});

function Page() {
  const { data: workflowData, isLoading, error } = useQuery({
    queryKey: ["workflow-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Workflow Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Workflow Manager" subtitle="Workflow management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Workflow Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Workflows", value: "18", delta: "+2", up: true },
    { label: "Avg Completion Time", value: "3.2h", delta: "-0.5h", up: true },
    { label: "Automation Level", value: "72%", delta: "+5%", up: true },
    { label: "Error Rate", value: "2.3%", delta: "-0.8%", up: true },
  ];

  const columns = [
    { key: "workflow", label: "Workflow" },
    { key: "steps", label: "Steps" },
    { key: "status", label: "Status" },
    { key: "lastRun", label: "Last Run" },
  ];

  const rows = [
    { workflow: "Employee Onboarding", steps: "8", status: "Active", lastRun: "2h ago" },
    { workflow: "Purchase Approval", steps: "5", status: "Active", lastRun: "4h ago" },
    { workflow: "Document Review", steps: "4", status: "Active", lastRun: "1d ago" },
    { workflow: "Incident Response", steps: "6", status: "Active", lastRun: "3d ago" },
    { workflow: "Monthly Reporting", steps: "3", status: "Scheduled", lastRun: "1w ago" },
  ];

  return (
    <AppShell>
      <ModulePage title="Workflow Manager" subtitle="Workflow management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
