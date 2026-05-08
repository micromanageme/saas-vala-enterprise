import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/critical-ops-manager")({
  head: () => ({ meta: [{ title: "Critical Ops Manager — SaaS Vala" }, { name: "description", content: "Critical operations management" }] }),
  component: Page,
});

function Page() {
  const { data: criticalOpsData, isLoading, error } = useQuery({
    queryKey: ["critical-ops-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Critical Ops Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Critical Ops Manager" subtitle="Critical operations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Critical Ops Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Critical Systems", value: "12", delta: "+1", up: true },
    { label: "System Availability", value: "99.9%", delta: "+0.1%", up: true },
    { label: "Ops Readiness", value: "98%", delta: "+2%", up: true },
    { label: "Escalations", value: "1", delta: "-1", up: true },
  ];

  const columns = [
    { key: "system", label: "Critical System" },
    { key: "availability", label: "Availability" },
    { key: "sla", label: "SLA" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { system: "Payment Processing", availability: "99.99%", sla: "99.95%", status: "Healthy" },
    { system: "User Authentication", availability: "99.98%", sla: "99.95%", status: "Healthy" },
    { system: "Order Processing", availability: "99.95%", sla: "99.90%", status: "Healthy" },
    { system: "Data Sync", availability: "99.92%", sla: "99.90%", status: "Healthy" },
    { system: "Notification Service", availability: "99.90%", sla: "99.85%", status: "Degraded" },
  ];

  return (
    <AppShell>
      <ModulePage title="Critical Ops Manager" subtitle="Critical operations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
