import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/quality-manager")({
  head: () => ({ meta: [{ title: "Quality Manager — SaaS Vala" }, { name: "description", content: "Quality assurance management" }] }),
  component: Page,
});

function Page() {
  const { data: qualityData, isLoading, error } = useQuery({
    queryKey: ["quality-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Quality Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Quality Manager" subtitle="Quality assurance management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Quality Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Quality Score", value: "96.5%", delta: "+1.2%", up: true },
    { label: "Defect Rate", value: "1.2%", delta: "-0.3%", up: true },
    { label: "Audits Passed", value: "45", delta: "+5", up: true },
    { label: "Customer Satisfaction", value: "4.6/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "check", label: "Quality Check" },
    { key: "score", label: "Score" },
    { key: "status", label: "Status" },
    { key: "lastAudit", label: "Last Audit" },
  ];

  const rows = [
    { check: "Product Quality", score: "98%", status: "Passed", lastAudit: "2d ago" },
    { check: "Process Compliance", score: "95%", status: "Passed", lastAudit: "3d ago" },
    { check: "Documentation", score: "92%", status: "Passed", lastAudit: "5d ago" },
    { check: "Safety Standards", score: "100%", status: "Passed", lastAudit: "1w ago" },
    { check: "Environmental Compliance", score: "97%", status: "Passed", lastAudit: "2w ago" },
  ];

  return (
    <AppShell>
      <ModulePage title="Quality Manager" subtitle="Quality assurance management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
