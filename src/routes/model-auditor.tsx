import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/model-auditor")({
  head: () => ({ meta: [{ title: "Model Auditor — SaaS Vala" }, { name: "description", content: "AI model auditing" }] }),
  component: Page,
});

function Page() {
  const { data: auditorData, isLoading, error } = useQuery({
    queryKey: ["model-auditor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Model Auditor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Model Auditor" subtitle="AI model auditing" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Model Auditor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Models Audited", value: "12", delta: "+3", up: true },
    { label: "Compliance Score", value: "96%", delta: "+2%", up: true },
    { label: "Bias Detected", value: "2", delta: "-1", up: true },
    { label: "Issues Resolved", value: "8", delta: "+2", up: true },
  ];

  const columns = [
    { key: "model", label: "Model" },
    { key: "auditType", label: "Audit Type" },
    { key: "score", label: "Score" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { model: "Customer Support Bot", auditType: "Bias Check", score: "94/100", status: "Passed" },
    { model: "Code Generator", auditType: "Security", score: "98/100", status: "Passed" },
    { model: "Content Writer", auditType: "Quality", score: "92/100", status: "Passed" },
    { model: "Data Analyzer", auditType: "Privacy", score: "96/100", status: "Passed" },
    { model: "Translation Engine", auditType: "Accuracy", score: "95/100", status: "Passed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Model Auditor" subtitle="AI model auditing" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
