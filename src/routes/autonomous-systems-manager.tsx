import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/autonomous-systems-manager")({
  head: () => ({ meta: [{ title: "Autonomous Systems Manager — SaaS Vala" }, { name: "description", content: "Autonomous systems management" }] }),
  component: Page,
});

function Page() {
  const { data: autonomousData, isLoading, error } = useQuery({
    queryKey: ["autonomous-systems-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Autonomous Systems Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Autonomous Systems Manager" subtitle="Autonomous systems management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Autonomous Systems Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Autonomous Systems", value: "12", delta: "+2", up: true },
    { label: "Automation Rate", value: "78%", delta: "+5%", up: true },
    { label: "Human Interventions", value: "5", delta: "-2", up: true },
    { label: "System Uptime", value: "99.8%", delta: "+0.1%", up: true },
  ];

  const columns = [
    { key: "system", label: "Autonomous System" },
    { key: "domain", label: "Domain" },
    { key: "autonomy", label: "Autonomy Level" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { system: "Auto-Scaling System", domain: "Infrastructure", autonomy: "High", status: "Active" },
    { system: "Self-Healing Network", domain: "Network", autonomy: "High", status: "Active" },
    { system: "Auto-Backup System", domain: "Storage", autonomy: "Medium", status: "Active" },
    { system: "Auto-Monitoring System", domain: "Operations", autonomy: "High", status: "Active" },
    { system: "Auto-Security System", domain: "Security", autonomy: "Medium", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Autonomous Systems Manager" subtitle="Autonomous systems management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
