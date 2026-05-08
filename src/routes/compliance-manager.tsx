import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/compliance-manager")({
  head: () => ({ meta: [{ title: "Compliance Manager — SaaS Vala" }, { name: "description", content: "Compliance operations management" }] }),
  component: Page,
});

function Page() {
  const { data: compData, isLoading, error } = useQuery({
    queryKey: ["compliance-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Compliance Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Compliance Manager" subtitle="Compliance operations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Compliance Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Compliance Score", value: "96%", delta: "+2%", up: true },
    { label: "Open Audits", value: "2", delta: "-1", up: true },
    { label: "Policies Active", value: "45", delta: "+3", up: true },
    { label: "Training Complete", value: "94%", delta: "+5%", up: true },
  ] : [];

  const columns = [
    { key: "framework", label: "Framework" },
    { key: "status", label: "Status" },
    { key: "lastAudit", label: "Last Audit" },
    { key: "nextAudit", label: "Next Audit" },
  ];

  const rows = [
    { framework: "SOC 2 Type II", status: "Compliant", lastAudit: "Mar 2024", nextAudit: "Mar 2025" },
    { framework: "GDPR", status: "Compliant", lastAudit: "Feb 2024", nextAudit: "Feb 2025" },
    { framework: "HIPAA", status: "Compliant", lastAudit: "Jan 2024", nextAudit: "Jan 2025" },
    { framework: "ISO 27001", status: "In Progress", lastAudit: "—", nextAudit: "—" },
    { framework: "PCI DSS", status: "Compliant", lastAudit: "Apr 2024", nextAudit: "Apr 2025" },
  ];

  return (
    <AppShell>
      <ModulePage title="Compliance Manager" subtitle="Compliance operations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
