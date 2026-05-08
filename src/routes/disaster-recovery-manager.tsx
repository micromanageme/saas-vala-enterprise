import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/disaster-recovery-manager")({
  head: () => ({ meta: [{ title: "Disaster Recovery Manager — SaaS Vala" }, { name: "description", content: "Disaster recovery management" }] }),
  component: Page,
});

function Page() {
  const { data: drData, isLoading, error } = useQuery({
    queryKey: ["disaster-recovery-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Disaster Recovery Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Disaster Recovery Manager" subtitle="Disaster recovery management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Disaster Recovery Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Backup Health", value: "100%", delta: "—", up: true },
    { label: "RTO Compliance", value: "98%", delta: "+2%", up: true },
    { label: "RPO Compliance", value: "99%", delta: "+1%", up: true },
    { label: "Drills Completed", value: "8", delta: "+2", up: true },
  ];

  const columns = [
    { key: "system", label: "System" },
    { key: "backupStatus", label: "Backup Status" },
    { key: "lastBackup", label: "Last Backup" },
    { key: "recoveryTime", label: "Recovery Time" },
  ];

  const rows = [
    { system: "Primary Database", backupStatus: "Healthy", lastBackup: "2h ago", recoveryTime: "15min" },
    { system: "Application Servers", backupStatus: "Healthy", lastBackup: "4h ago", recoveryTime: "30min" },
    { system: "Storage Systems", backupStatus: "Healthy", lastBackup: "6h ago", recoveryTime: "1h" },
    { system: "Network Infrastructure", backupStatus: "Healthy", lastBackup: "12h ago", recoveryTime: "2h" },
    { system: "Cloud Resources", backupStatus: "Healthy", lastBackup: "1h ago", recoveryTime: "45min" },
  ];

  return (
    <AppShell>
      <ModulePage title="Disaster Recovery Manager" subtitle="Disaster recovery management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
