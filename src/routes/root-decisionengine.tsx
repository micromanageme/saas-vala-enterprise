import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-decisionengine")({
  head: () => ({ meta: [{ title: "Root Decision Engine — Universal Access Admin" }, { name: "description", content: "Automated governance decisions, risk-aware execution, approval intelligence" }] }),
  component: Page,
});

function Page() {
  const { data: decisionData, isLoading, error } = useQuery({
    queryKey: ["root-decisionengine"],
    queryFn: async () => {
      const response = await fetch("/api/root/decision-engine?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch decision engine data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Decision Engine" subtitle="Automated governance decisions, risk-aware execution, approval intelligence" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Decision Engine data</div>
      </AppShell>
    );
  }

  const data = decisionData?.data;
  const decisions = data?.automatedDecisions || [];
  const risk = data?.riskAwareExecution;

  const kpis = risk ? [
    { label: "Total Decisions", value: risk.totalDecisions.toLocaleString(), delta: "—", up: true },
    { label: "Low Risk", value: risk.lowRiskDecisions.toString(), delta: "—", up: true },
    { label: "Rejected", value: risk.rejectedDecisions.toString(), delta: "—", up: risk.rejectedDecisions === 0 },
  ] : [];

  const columns = [
    { key: "type", label: "Type" },
    { key: "riskLevel", label: "Risk Level" },
    { key: "approved", label: "Approved" },
    { key: "reason", label: "Reason" },
  ];

  const rows = decisions.map((d: any) => ({
    type: d.type,
    riskLevel: d.riskLevel,
    approved: d.approved ? "Yes" : "No",
    reason: d.reason,
  }));

  return (
    <AppShell>
      <ModulePage title="Root Decision Engine" subtitle="Automated governance decisions, risk-aware execution, approval intelligence" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
