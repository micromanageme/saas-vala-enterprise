import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/recovery-commander")({
  head: () => ({ meta: [{ title: "Recovery Commander — SaaS Vala" }, { name: "description", content: "Recovery command center" }] }),
  component: Page,
});

function Page() {
  const { data: recoveryData, isLoading, error } = useQuery({
    queryKey: ["recovery-commander-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Recovery Commander data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Recovery Commander" subtitle="Recovery command center" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Recovery Commander data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Recoveries", value: "2", delta: "-1", up: true },
    { label: "Recovery Success Rate", value: "98%", delta: "+1%", up: true },
    { label: "Avg Recovery Time", value: "45min", delta: "-15min", up: true },
    { label: "RTO Compliance", value: "99%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "recovery", label: "Recovery Operation" },
    { key: "severity", label: "Severity" },
    { key: "progress", label: "Progress" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { recovery: "REC-001234", severity: "Critical", progress: "75%", status: "In Progress" },
    { recovery: "REC-001235", severity: "High", progress: "90%", status: "In Progress" },
    { recovery: "REC-001236", severity: "Medium", progress: "100%", status: "Complete" },
    { recovery: "REC-001237", severity: "Low", progress: "100%", status: "Complete" },
    { recovery: "REC-001238", severity: "Critical", progress: "50%", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Recovery Commander" subtitle="Recovery command center" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
