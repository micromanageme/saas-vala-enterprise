import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/process-manager")({
  head: () => ({ meta: [{ title: "Process Manager — SaaS Vala" }, { name: "description", content: "Process management" }] }),
  component: Page,
});

function Page() {
  const { data: processData, isLoading, error } = useQuery({
    queryKey: ["process-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Process Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Process Manager" subtitle="Process management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Process Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Processes", value: "23", delta: "+3", up: true },
    { label: "Process Efficiency", value: "88%", delta: "+5%", up: true },
    { label: "Bottlenecks Resolved", value: "5", delta: "+2", up: true },
    { label: "Automation Rate", value: "65%", delta: "+8%", up: true },
  ];

  const columns = [
    { key: "process", label: "Process" },
    { key: "cycleTime", label: "Cycle Time" },
    { key: "efficiency", label: "Efficiency" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { process: "Order Processing", cycleTime: "2.5h", efficiency: "92%", status: "Optimized" },
    { process: "Approval Workflow", cycleTime: "4h", efficiency: "85%", status: "Needs Improvement" },
    { process: "Data Entry", cycleTime: "1h", efficiency: "95%", status: "Optimized" },
    { process: "Quality Check", cycleTime: "3h", efficiency: "88%", status: "In Progress" },
    { process: "Report Generation", cycleTime: "30min", efficiency: "98%", status: "Optimized" },
  ];

  return (
    <AppShell>
      <ModulePage title="Process Manager" subtitle="Process management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
