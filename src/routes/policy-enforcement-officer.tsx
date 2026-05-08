import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/policy-enforcement-officer")({
  head: () => ({ meta: [{ title: "Policy Enforcement Officer — SaaS Vala" }, { name: "description", content: "Policy enforcement workspace" }] }),
  component: Page,
});

function Page() {
  const { data: policyData, isLoading, error } = useQuery({
    queryKey: ["policy-enforcement-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Policy Enforcement Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Policy Enforcement Officer" subtitle="Policy enforcement workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Policy Enforcement Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Policies Enforced", value: "23", delta: "+2", up: true },
    { label: "Violations Detected", value: "45", delta: "+8", up: false },
    { label: "Enforcement Rate", value: "92%", delta: "+3%", up: true },
    { label: "Auto-Remediation", value: "78%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "policy", label: "Policy" },
    { key: "violations", label: "Violations" },
    { key: "enforcement", label: "Enforcement" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { policy: "Access Control", violations: "12", enforcement: "Auto", status: "Active" },
    { policy: "Data Classification", violations: "8", enforcement: "Auto", status: "Active" },
    { policy: "Password Policy", violations: "5", enforcement: "Auto", status: "Active" },
    { policy: "Network Security", violations: "15", enforcement: "Manual", status: "Active" },
    { policy: "Compliance", violations: "5", enforcement: "Auto", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Policy Enforcement Officer" subtitle="Policy enforcement workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
