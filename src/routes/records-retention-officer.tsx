import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/records-retention-officer")({
  head: () => ({ meta: [{ title: "Records Retention Officer — SaaS Vala" }, { name: "description", content: "Records retention management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: retentionData, isLoading, error } = useQuery({
    queryKey: ["records-retention-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Records Retention Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Records Retention Officer" subtitle="Records retention management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Records Retention Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Retention Policies", value: "45", delta: "+5", up: true },
    { label: "Records Scheduled", value: "5K", delta: "+500", up: true },
    { label: "Compliance Rate", value: "98%", delta: "+1%", up: true },
    { label: "Auto-Archived", value: "2K", delta: "+200", up: true },
  ];

  const columns = [
    { key: "policy", label: "Retention Policy" },
    { key: "record", label: "Record Type" },
    { key: "period", label: "Retention Period" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { policy: "POL-001", record: "Financial", period: "7 years", status: "Active" },
    { policy: "POL-002", record: "Legal", period: "10 years", status: "Active" },
    { policy: "POL-003", record: "HR", period: "5 years", status: "Active" },
    { policy: "POL-004", record: "Medical", period: "25 years", status: "In Review" },
    { policy: "POL-005", record: "General", period: "3 years", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Records Retention Officer" subtitle="Records retention management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
