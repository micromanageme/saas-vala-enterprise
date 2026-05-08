import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/privileged-access-governance-lead")({
  head: () => ({ meta: [{ title: "Privileged Access Governance Lead — SaaS Vala" }, { name: "description", content: "Privileged access governance workspace" }] }),
  component: Page,
});

function Page() {
  const { data: privilegedData, isLoading, error } = useQuery({
    queryKey: ["privileged-access-governance-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Privileged Access Governance Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Privileged Access Governance Lead" subtitle="Privileged access governance workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Privileged Access Governance Lead data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Privileged Accounts", value: "150", delta: "+10", up: true },
    { label: "Session Reviews", value: "95%", delta: "+2%", up: true },
    { label: "PAM Compliance", value: "98%", delta: "+1%", up: true },
    { label: "Escalations", value: "5", delta: "-1", up: true },
  ];

  const columns = [
    { key: "account", label: "Privileged Account" },
    { key: "type", label: "Type" },
    { key: "sessions", label: "Sessions" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { account: "PAM-001", type: "Admin", sessions: "50", status: "Active" },
    { account: "PAM-002", type: "Service", sessions: "30", status: "Active" },
    { account: "PAM-003", type: "Database", sessions: "25", status: "In Review" },
    { account: "PAM-004", type: "Application", sessions: "20", status: "Active" },
    { account: "PAM-005", type: "Root", sessions: "15", status: "Monitored" },
  ];

  return (
    <AppShell>
      <ModulePage title="Privileged Access Governance Lead" subtitle="Privileged access governance workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
