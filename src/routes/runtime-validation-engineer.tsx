import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/runtime-validation-engineer")({
  head: () => ({ meta: [{ title: "Runtime Validation Engineer — SaaS Vala" }, { name: "description", content: "Runtime validation engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: validationData, isLoading, error } = useQuery({
    queryKey: ["runtime-validation-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Runtime Validation Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Runtime Validation Engineer" subtitle="Runtime validation engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Runtime Validation Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Validations Run", value: "12.5K", delta: "+1.5K", up: true },
    { label: "Pass Rate", value: "98%", delta: "+1%", up: true },
    { label: "Failures Blocked", value: "45", delta: "+5", up: true },
    { label: "Avg Check Time", value: "2ms", delta: "-0.5ms", up: true },
  ];

  const columns = [
    { key: "rule", label: "Validation Rule" },
    { key: "type", label: "Type" },
    { key: "checks", label: "Checks/Min" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { rule: "RULE-001", type: "Schema", checks: "500", status: "Active" },
    { rule: "RULE-002", type: "Business Logic", checks: "300", status: "Active" },
    { rule: "RULE-003", type: "Security", checks: "200", status: "Active" },
    { rule: "RULE-004", type: "Data Integrity", checks: "400", status: "Active" },
    { rule: "RULE-005", type: "Format", checks: "600", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="Runtime Validation Engineer" subtitle="Runtime validation engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
