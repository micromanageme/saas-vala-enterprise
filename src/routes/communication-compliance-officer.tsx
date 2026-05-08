import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/communication-compliance-officer")({
  head: () => ({ meta: [{ title: "Communication Compliance Officer — SaaS Vala" }, { name: "description", content: "Communication compliance workspace" }] }),
  component: Page,
});

function Page() {
  const { data: complianceData, isLoading, error } = useQuery({
    queryKey: ["communication-compliance-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Communication Compliance Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Communication Compliance Officer" subtitle="Communication compliance workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Communication Compliance Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Audits Completed", value: "125", delta: "+15", up: true },
    { label: "Compliance Rate", value: "96%", delta: "+2%", up: true },
    { label: "Violations", value: "3", delta: "-1", up: true },
    { label: "Remediations", value: "95%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "audit", label: "Compliance Audit" },
    { key: "channel", label: "Channel" },
    { key: "result", label: "Result" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { audit: "AUD-001", channel: "Email", result: "Compliant", status: "Completed" },
    { audit: "AUD-002", channel: "SMS", result: "Compliant", status: "Completed" },
    { audit: "AUD-003", channel: "Push", result: "Warning", status: "In Review" },
    { audit: "AUD-004", channel: "Email", result: "Compliant", status: "Completed" },
    { audit: "AUD-005", channel: "SMS", result: "Compliant", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Communication Compliance Officer" subtitle="Communication compliance workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
