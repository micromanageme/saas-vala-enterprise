import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/risk-underwriter")({
  head: () => ({ meta: [{ title: "Risk Underwriter — SaaS Vala" }, { name: "description", content: "Risk underwriting workspace" }] }),
  component: Page,
});

function Page() {
  const { data: riskData, isLoading, error } = useQuery({
    queryKey: ["risk-underwriter-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Risk Underwriter data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Risk Underwriter" subtitle="Risk underwriting workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Risk Underwriter data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Risk Assessments", value: "85", delta: "+10", up: true },
    { label: "High Risk Identified", value: "12", delta: "-2", up: true },
    { key: "mitigation", label: "Mitigation Plans", value: "45", delta: "+5", up: true },
    { label: "Risk Score", value: "72", delta: "-3", up: true },
  ];

  const columns = [
    { key: "assessment", label: "Risk Assessment" },
    { key: "category", label: "Category" },
    { key: "level", label: "Risk Level" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { assessment: "RISK-001", category: "Credit Risk", level: "Medium", status: "In Review" },
    { assessment: "RISK-002", category: "Market Risk", level: "High", status: "Active" },
    { assessment: "RISK-003", category: "Operational Risk", level: "Low", status: "Mitigated" },
    { assessment: "RISK-004", category: "Liquidity Risk", level: "Medium", status: "In Review" },
    { assessment: "RISK-005", category: "Compliance Risk", level: "Low", status: "Mitigated" },
  ];

  return (
    <AppShell>
      <ModulePage title="Risk Underwriter" subtitle="Risk underwriting workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
