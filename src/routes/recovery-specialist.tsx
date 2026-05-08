import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/recovery-specialist")({
  head: () => ({ meta: [{ title: "Recovery Specialist — SaaS Vala" }, { name: "description", content: "Recovery specialist workspace" }] }),
  component: Page,
});

function Page() {
  const { data: recoveryData, isLoading, error } = useQuery({
    queryKey: ["recovery-specialist-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Recovery Specialist data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Recovery Specialist" subtitle="Recovery specialist workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Recovery Specialist data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Recovery Tasks", value: "8", delta: "-2", up: true },
    { label: "Success Rate", value: "96%", delta: "+2%", up: true },
    { label: "Avg Recovery Time", value: "35min", delta: "-10min", up: true },
    { label: "Backups Verified", value: "45", delta: "+5", up: true },
  ];

  const columns = [
    { key: "task", label: "Recovery Task" },
    { key: "system", label: "System" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { task: "Database Restore", system: "Primary DB", priority: "High", status: "In Progress" },
    { task: "File Recovery", system: "File Server", priority: "Medium", status: "Complete" },
    { task: "Service Restart", system: "API Gateway", priority: "High", status: "In Progress" },
    { task: "Data Sync", system: "Cache", priority: "Low", status: "Pending" },
    { task: "Configuration Restore", system: "App Config", priority: "Medium", status: "Complete" },
  ];

  return (
    <AppShell>
      <ModulePage title="Recovery Specialist" subtitle="Recovery specialist workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
