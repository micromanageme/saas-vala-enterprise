import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dispatcher")({
  head: () => ({ meta: [{ title: "Dispatcher — SaaS Vala" }, { name: "description", content: "Dispatching workspace" }] }),
  component: Page,
});

function Page() {
  const { data: dispatchData, isLoading, error } = useQuery({
    queryKey: ["dispatcher-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Dispatcher data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Dispatcher" subtitle="Dispatching workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Dispatcher data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Jobs Dispatched", value: "125", delta: "+15", up: true },
    { label: "Technicians Available", value: "8", delta: "+2", up: true },
    { label: "Response Time", value: "45min", delta: "-10min", up: true },
    { label: "Efficiency", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "job", label: "Job ID" },
    { key: "technician", label: "Assigned Technician" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { job: "JOB-001", technician: "TECH-001", priority: "High", status: "Dispatched" },
    { job: "JOB-002", technician: "TECH-002", priority: "Critical", status: "In Progress" },
    { job: "JOB-003", technician: "TECH-003", priority: "Medium", status: "Dispatched" },
    { job: "JOB-004", technician: "TECH-004", priority: "Low", status: "Completed" },
    { job: "JOB-005", technician: "TECH-005", priority: "High", status: "Dispatched" },
  ];

  return (
    <AppShell>
      <ModulePage title="Dispatcher" subtitle="Dispatching workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
