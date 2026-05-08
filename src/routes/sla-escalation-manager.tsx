import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/sla-escalation-manager")({
  head: () => ({ meta: [{ title: "SLA Escalation Manager — SaaS Vala" }, { name: "description", content: "SLA escalation management" }] }),
  component: Page,
});

function Page() {
  const { data: slaData, isLoading, error } = useQuery({
    queryKey: ["sla-escalation-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch SLA Escalation Manager data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="SLA Escalation Manager" subtitle="SLA escalation management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load SLA Escalation Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Escalated Tickets", value: "5", delta: "-1", up: true },
    { label: "SLA Breaches", value: "1", delta: "-1", up: true },
    { label: "SLA Compliance", value: "98.5%", delta: "+0.5%", up: true },
    { label: "Avg Escalation Time", value: "1.2h", delta: "-0.3h", up: true },
  ];

  const columns = [
    { key: "ticket", label: "Ticket" },
    { key: "sla", label: "SLA" },
    { key: "breachTime", label: "Breach Time" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { ticket: "TKT-001234", sla: "4h", breachTime: "30min", status: "Critical" },
    { ticket: "TKT-001235", sla: "8h", breachTime: "2h", status: "Warning" },
    { ticket: "TKT-001236", sla: "24h", breachTime: "12h", status: "Monitoring" },
    { ticket: "TKT-001237", sla: "4h", breachTime: "1h", status: "Resolved" },
    { ticket: "TKT-001238", sla: "8h", breachTime: "6h", status: "Monitoring" },
  ];

  return (
    <AppShell>
      <ModulePage title="SLA Escalation Manager" subtitle="SLA escalation management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
