import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/evidence-preservation-officer")({
  head: () => ({ meta: [{ title: "Evidence Preservation Officer — SaaS Vala" }, { name: "description", content: "Evidence preservation workspace" }] }),
  component: Page,
});

function Page() {
  const { data: evidenceData, isLoading, error } = useQuery({
    queryKey: ["evidence-preservation-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Evidence Preservation Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Evidence Preservation Officer" subtitle="Evidence preservation workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Evidence Preservation Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Evidence Items", value: "2.5K", delta: "+250", up: true },
    { label: "Chain of Custody", value: "100%", delta: "0%", up: true },
    { label: "Storage", value: "50TB", delta: "+5TB", up: true },
    { label: "Integrity", value: "100%", delta: "0%", up: true },
  ];

  const columns = [
    { key: "evidence", label: "Evidence Item" },
    { key: "type", label: "Type" },
    { key: "case", label: "Case" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { evidence: "EVD-001", type: "Digital", case: "FOR-001", status: "Preserved" },
    { evidence: "EVD-002", type: "Physical", case: "FOR-002", status: "Preserved" },
    { evidence: "EVD-003", type: "Digital", case: "FOR-003", status: "In Process" },
    { evidence: "EVD-004", type: "Digital", case: "FOR-004", status: "Preserved" },
    { evidence: "EVD-005", type: "Physical", case: "FOR-005", status: "Preserved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Evidence Preservation Officer" subtitle="Evidence preservation workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
