import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/meta-governance-lead")({
  head: () => ({ meta: [{ title: "Meta Governance Lead — SaaS Vala" }, { name: "description", content: "Meta governance workspace" }] }),
  component: Page,
});

function Page() {
  const { data: governanceData, isLoading, error } = useQuery({
    queryKey: ["meta-governance-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Meta Governance Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Meta Governance Lead" subtitle="Meta governance workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Meta Governance Lead data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Governance Domains", value: "15", delta: "+2", up: true },
    { label: "Policies Enforced", value: "125", delta: "+15", up: true },
    { label: "Compliance", value: "96%", delta: "+2%", up: true },
    { label: "Audit Score", value: "4.8/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "domain", label: "Governance Domain" },
    { key: "scope", label: "Scope" },
    { key: "controls", label: "Controls" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { domain: "GOV-001", scope: "Global", controls: "20", status: "Active" },
    { domain: "GOV-002", scope: "Regional", controls: "15", status: "Active" },
    { domain: "GOV-003", scope: "System", controls: "25", status: "Active" },
    { domain: "GOV-004", scope: "Data", controls: "18", status: "In Review" },
    { domain: "GOV-005", scope: "Process", controls: "22", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Meta Governance Lead" subtitle="Meta governance workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
