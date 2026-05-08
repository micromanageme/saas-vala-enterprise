import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/audit-trail-governor")({
  head: () => ({ meta: [{ title: "Audit Trail Governor — SaaS Vala" }, { name: "description", content: "Audit trail governance workspace" }] }),
  component: Page,
});

function Page() {
  const { data: auditData, isLoading, error } = useQuery({
    queryKey: ["audit-trail-governor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Audit Trail Governor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Audit Trail Governor" subtitle="Audit trail governance workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Audit Trail Governor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Audit Logs", value: "5M", delta: "+500K", up: true },
    { label: "Retention Compliance", value: "99%", delta: "+0.5%", up: true },
    { label: "Integrity", value: "100%", delta: "0%", up: true },
    { label: "Access Control", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "trail", label: "Audit Trail" },
    { key: "source", label: "Source System" },
    { key: "entries", label: "Entries" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { trail: "AUD-001", source: "Application", entries: "1M", status: "Active" },
    { trail: "AUD-002", source: "Database", entries: "1.5M", status: "Active" },
    { trail: "AUD-003", source: "System", entries: "800K", status: "Active" },
    { trail: "AUD-004", source: "Security", entries: "1M", status: "Active" },
    { trail: "AUD-005", source: "Network", entries: "700K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Audit Trail Governor" subtitle="Audit trail governance workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
