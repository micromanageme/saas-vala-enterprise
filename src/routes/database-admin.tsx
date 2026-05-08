import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/database-admin")({
  head: () => ({ meta: [{ title: "Database Admin — SaaS Vala" }, { name: "description", content: "Database management" }] }),
  component: Page,
});

function Page() {
  const { data: dbData, isLoading, error } = useQuery({
    queryKey: ["database-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Database Admin data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Database Admin" subtitle="Database management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Database Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Databases", value: "8", delta: "+1", up: true },
    { label: "Total Size", value: "2.5TB", delta: "+0.5TB", up: true },
    { label: "Backup Status", value: "Current", delta: "—", up: true },
    { label: "Query Performance", value: "Excellent", delta: "+5%", up: true },
  ] : [];

  const columns = [
    { key: "database", label: "Database" },
    { key: "size", label: "Size" },
    { key: "status", label: "Status" },
    { key: "lastBackup", label: "Last Backup" },
  ];

  const rows = [
    { database: "primary_db", size: "850GB", status: "Healthy", lastBackup: "2h ago" },
    { database: "analytics_db", size: "1.2TB", status: "Healthy", lastBackup: "4h ago" },
    { database: "cache_db", size: "250GB", status: "Healthy", lastBackup: "1h ago" },
    { database: "logs_db", size: "200GB", status: "Healthy", lastBackup: "6h ago" },
  ];

  return (
    <AppShell>
      <ModulePage title="Database Admin" subtitle="Database management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
