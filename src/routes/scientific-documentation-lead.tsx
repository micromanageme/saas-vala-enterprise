import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/scientific-documentation-lead")({
  head: () => ({ meta: [{ title: "Scientific Documentation Lead — SaaS Vala" }, { name: "description", content: "Scientific documentation workspace" }] }),
  component: Page,
});

function Page() {
  const { data: docData, isLoading, error } = useQuery({
    queryKey: ["scientific-documentation-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Scientific Documentation Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Scientific Documentation Lead" subtitle="Scientific documentation workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Scientific Documentation Lead data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Documents Created", value: "125", delta: "+15", up: true },
    { label: "Protocols Written", value: "45", delta: "+5", up: true },
    { label: "Compliance Rate", value: "98%", delta: "+1%", up: true },
    { label: "Review Time", value: "3 days", delta: "-1 day", up: true },
  ];

  const columns = [
    { key: "document", label: "Document" },
    { key: "type", label: "Type" },
    { key: "version", label: "Version" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { document: "DOC-001", type: "Protocol", version: "v2.0", status: "Approved" },
    { document: "DOC-002", type: "Report", version: "v1.5", status: "In Review" },
    { document: "DOC-003", type: "SOP", version: "v3.0", status: "Approved" },
    { document: "DOC-004", type: "Manual", version: "v1.0", status: "Draft" },
    { document: "DOC-005", type: "Protocol", version: "v2.5", status: "Approved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Scientific Documentation Lead" subtitle="Scientific documentation workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
