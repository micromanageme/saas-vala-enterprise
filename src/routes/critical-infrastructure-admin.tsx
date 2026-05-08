import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/critical-infrastructure-admin")({
  head: () => ({ meta: [{ title: "Critical Infrastructure Admin — SaaS Vala" }, { name: "description", content: "Critical infrastructure administration" }] }),
  component: Page,
});

function Page() {
  const { data: infraData, isLoading, error } = useQuery({
    queryKey: ["critical-infrastructure-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Critical Infrastructure Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Critical Infrastructure Admin" subtitle="Critical infrastructure administration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Critical Infrastructure Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Critical Systems", value: "12", delta: "+1", up: true },
    { label: "System Availability", value: "99.9%", delta: "+0.1%", up: true },
    { label: "Maintenance Windows", value: "2", delta: "-1", up: true },
    { label: "Compliance", value: "100%", delta: "—", up: true },
  ];

  const columns = [
    { key: "system", label: "Critical System" },
    { key: "availability", label: "Availability" },
    { key: "sla", label: "SLA Target" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { system: "Core Database Cluster", availability: "99.99%", sla: "99.95%", status: "Healthy" },
    { system: "Payment Processing", availability: "99.98%", sla: "99.95%", status: "Healthy" },
    { system: "Authentication Service", availability: "99.97%", sla: "99.95%", status: "Healthy" },
    { system: "API Gateway", availability: "99.95%", sla: "99.90%", status: "Healthy" },
    { system: "Data Backup System", availability: "99.92%", sla: "99.90%", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Critical Infrastructure Admin" subtitle="Critical infrastructure administration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
