import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/data-quality-engineer")({
  head: () => ({ meta: [{ title: "Data Quality Engineer — SaaS Vala" }, { name: "description", content: "Data quality engineering" }] }),
  component: Page,
});

function Page() {
  const { data: dqData, isLoading, error } = useQuery({
    queryKey: ["data-quality-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Data Quality Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Data Quality Engineer" subtitle="Data quality engineering" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Data Quality Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Quality Rules", value: "45", delta: "+5", up: true },
    { label: "Data Quality Score", value: "94%", delta: "+2%", up: true },
    { label: "Issues Detected", value: "23", delta: "-8", up: true },
    { label: "Automated Fixes", value: "156", delta: "+23", up: true },
  ];

  const columns = [
    { key: "rule", label: "Quality Rule" },
    { key: "type", label: "Type" },
    { key: "passRate", label: "Pass Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { rule: "Email Validation", type: "Format", passRate: "98%", status: "Active" },
    { rule: "Phone Validation", type: "Format", passRate: "95%", status: "Active" },
    { rule: "Duplicate Detection", type: "Uniqueness", passRate: "92%", status: "Active" },
    { rule: "Null Check", type: "Completeness", passRate: "99%", status: "Active" },
    { rule: "Range Validation", type: "Consistency", passRate: "96%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Data Quality Engineer" subtitle="Data quality engineering" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
