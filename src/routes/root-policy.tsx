import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-policy")({
  head: () => ({ meta: [{ title: "Universal Policy Engine — Universal Access Admin" }, { name: "description", content: "Centralized policy execution, runtime injection, enforcement" }] }),
  component: Page,
});

function Page() {
  const { data: policyData, isLoading, error } = useQuery({
    queryKey: ["root-policy"],
    queryFn: async () => {
      const response = await fetch("/api/root/policy-engine?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch policy engine data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Policy Engine" subtitle="Centralized policy execution, runtime injection, enforcement" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Policy Engine data</div>
      </AppShell>
    );
  }

  const data = policyData?.data;
  const policies = data?.policies || [];
  const runtime = data?.runtimeInjection;

  const kpis = runtime ? [
    { label: "Active Policies", value: runtime.activePolicies.toString(), delta: "—", up: true },
    { label: "Injected", value: runtime.injectedPolicies.toString(), delta: "—", up: true },
    { label: "Pending", value: runtime.pendingInjection.toString(), delta: "—", up: runtime.pendingInjection === 0 },
  ];

  const columns = [
    { key: "name", label: "Policy" },
    { key: "status", label: "Status" },
    { key: "enforced", label: "Enforced" },
    { key: "violations", label: "Violations" },
  ];

  const rows = policies.map((p: any) => ({
    name: p.name,
    status: p.status,
    enforced: p.enforced ? "Yes" : "No",
    violations: p.violations.toString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Policy Engine" subtitle="Centralized policy execution, runtime injection, enforcement" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
