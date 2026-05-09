import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/soc-manager")({
  head: () => ({ meta: [{ title: "SOC Manager — SaaS Vala" }, { name: "description", content: "Security Operations Center management" }] }),
  component: Page,
});

function Page() {
  const { data: socData, isLoading, error } = useQuery({
    queryKey: ["soc-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch SOC Manager data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="SOC Manager" subtitle="Security Operations Center management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load SOC Manager data</div>
      </AppShell>
    );
  }

  const data = socData?.data;
  const security = data?.security;
  const kpis = security ? [
    { label: "Active Incidents", value: security.activeThreats.toString(), delta: "-2", up: security.activeThreats < 3 },
    { label: "Alerts Today", value: "45", delta: "+5", up: false },
    { label: "MTTR", value: "2.5h", delta: "-0.5h", up: true },
    { label: "SOC Coverage", value: "24/7", delta: "—", up: true },
  ] : [
    { label: "Active Incidents", value: "0", delta: "—", up: true },
    { label: "Alerts Today", value: "45", delta: "+5", up: false },
    { label: "MTTR", value: "2.5h", delta: "-0.5h", up: true },
    { label: "SOC Coverage", value: "24/7", delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "incident", label: "Incident" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
    { key: "assignee", label: "Assignee" },
  ];

  const rows = [
    { incident: "INC-001234", severity: "High", status: "In Progress", assignee: "John Smith" },
    { incident: "INC-001235", severity: "Medium", status: "In Progress", assignee: "Sarah Johnson" },
    { incident: "INC-001236", severity: "Low", status: "Resolved", assignee: "Mike Brown" },
    { incident: "INC-001237", severity: "Critical", status: "Escalated", assignee: "Emily Davis" },
    { incident: "INC-001238", severity: "Medium", status: "Resolved", assignee: "Alex Wilson" },
  ];

  return (
    <AppShell>
      <ModulePage title="SOC Manager" subtitle="Security Operations Center management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
