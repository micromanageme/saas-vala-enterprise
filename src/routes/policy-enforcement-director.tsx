import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/policy-enforcement-director")({
  head: () => ({ meta: [{ title: "Policy Enforcement Director — SaaS Vala" }, { name: "description", content: "Policy enforcement direction workspace" }] }),
  component: Page,
});

function Page() {
  const { data: policyData, isLoading, error } = useQuery({
    queryKey: ["policy-enforcement-director-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Policy Enforcement Director data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Policy Enforcement Director" subtitle="Policy enforcement direction workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Policy Enforcement Director data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Policies Active", value: "75", delta: "+5", up: true },
    { label: "Violations Detected", value: "25", delta: "+3", up: false },
    { label: "Enforcement Rate", value: "90%", delta: "+2%", up: true },
    { label: "Resolution Time", value: "2 days", delta: "-0.5 days", up: true },
  ];

  const columns = [
    { key: "policy", label: "Enforced Policy" },
    { key: "category", label: "Category" },
    { key: "violations", label: "Violations" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { policy: "POL-001", category: "Security", violations: "5", status: "Enforced" },
    { policy: "POL-002", category: "Data", violations: "3", status: "Enforced" },
    { policy: "POL-003", category: "Access", violations: "8", status: "In Review" },
    { policy: "POL-004", category: "Privacy", violations: "4", status: "Enforced" },
    { policy: "POL-005", category: "Compliance", violations: "5", status: "Enforced" },
  ];

  return (
    <AppShell>
      <ModulePage title="Policy Enforcement Director" subtitle="Policy enforcement direction workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
