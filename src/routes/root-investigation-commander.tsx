import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-investigation-commander")({
  head: () => ({ meta: [{ title: "Root Investigation Commander — SaaS Vala" }, { name: "description", content: "Root investigation command workspace" }] }),
  component: Page,
});

function Page() {
  const { data: investigationData, isLoading, error } = useQuery({
    queryKey: ["root-investigation-commander-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Root Investigation Commander data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Investigation Commander" subtitle="Root investigation command workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Investigation Commander data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Investigations", value: "15", delta: "+2", up: true },
    { label: "Root Cause Found", value: "93%", delta: "+2%", up: true },
    { label: "Resolution Time", value: "3 days", delta: "-0.5 days", up: true },
    { label: "Preventive Actions", value: "25", delta: "+3", up: true },
  ];

  const columns = [
    { key: "investigation", label: "Root Investigation" },
    { key: "severity", label: "Severity" },
    { key: "impact", label: "Impact" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { investigation: "INV-001", severity: "Critical", impact: "High", status: "In Progress" },
    { investigation: "INV-002", severity: "High", impact: "Medium", status: "Completed" },
    { investigation: "INV-003", severity: "Medium", impact: "Low", status: "Completed" },
    { investigation: "INV-004", severity: "Critical", impact: "High", status: "In Progress" },
    { investigation: "INV-005", severity: "High", impact: "Medium", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Investigation Commander" subtitle="Root investigation command workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
