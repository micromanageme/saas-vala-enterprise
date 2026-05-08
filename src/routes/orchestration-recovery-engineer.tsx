import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/orchestration-recovery-engineer")({
  head: () => ({ meta: [{ title: "Orchestration Recovery Engineer — SaaS Vala" }, { name: "description", content: "Orchestration recovery engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: recoveryData, isLoading, error } = useQuery({
    queryKey: ["orchestration-recovery-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Orchestration Recovery Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Orchestration Recovery Engineer" subtitle="Orchestration recovery engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Orchestration Recovery Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Recoveries Performed", value: "25", delta: "+3", up: true },
    { label: "Recovery Success", value: "96%", delta: "+2%", up: true },
    { label: "MTTR", value: "5min", delta: "-2min", up: true },
    { label: "Failovers", value: "8", delta: "+1", up: false },
  ];

  const columns = [
    { key: "recovery", label: "Recovery Job" },
    { key: "type", label: "Type" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { recovery: "REC-001", type: "Service", duration: "3min", status: "Completed" },
    { recovery: "REC-002", type: "Database", duration: "5min", status: "Completed" },
    { recovery: "REC-003", type: "Pipeline", duration: "2min", status: "In Progress" },
    { recovery: "REC-004", type: "Cache", duration: "1min", status: "Completed" },
    { recovery: "REC-005", type: "Message Queue", duration: "4min", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="Orchestration Recovery Engineer" subtitle="Orchestration recovery engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
