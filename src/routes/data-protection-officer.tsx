import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/data-protection-officer")({
  head: () => ({ meta: [{ title: "Data Protection Officer — SaaS Vala" }, { name: "description", content: "Data protection officer workspace" }] }),
  component: Page,
});

function Page() {
  const { data: dpoData, isLoading, error } = useQuery({
    queryKey: ["data-protection-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Data Protection Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Data Protection Officer" subtitle="Data protection officer workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Data Protection Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "GDPR Compliance", value: "98%", delta: "+1%", up: true },
    { label: "Breach Reports", value: "0", delta: "0", up: true },
    { label: "Risk Assessments", value: "45", delta: "+5", up: true },
    { label: "Training", value: "95%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "assessment", label: "Risk Assessment" },
    { key: "domain", label: "Domain" },
    { key: "risk", label: "Risk Level" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { assessment: "RISK-001", domain: "Processing", risk: "Medium", status: "Completed" },
    { assessment: "RISK-002", domain: "Storage", risk: "Low", status: "Completed" },
    { assessment: "RISK-003", domain: "Transfer", risk: "High", status: "In Progress" },
    { assessment: "RISK-004", domain: "Access", risk: "Medium", status: "Completed" },
    { assessment: "RISK-005", domain: "Retention", risk: "Low", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Data Protection Officer" subtitle="Data protection officer workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
