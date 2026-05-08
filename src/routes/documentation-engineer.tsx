import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/documentation-engineer")({
  head: () => ({ meta: [{ title: "Documentation Engineer — SaaS Vala" }, { name: "description", content: "Documentation engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: docData, isLoading, error } = useQuery({
    queryKey: ["documentation-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Documentation Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Documentation Engineer" subtitle="Documentation engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Documentation Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Documents Created", value: "125", delta: "+15", up: true },
    { label: "Pages Updated", value: "250", delta: "+30", up: true },
    { label: "Accuracy", value: "95%", delta: "+2%", up: true },
    { label: "Readership", value: "5K", delta: "+500", up: true },
  ];

  const columns = [
    { key: "document", label: "Documentation" },
    { key: "type", label: "Type" },
    { key: "version", label: "Version" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { document: "DOC-001", type: "API", version: "v2.0", status: "Published" },
    { document: "DOC-002", type: "User Guide", version: "v1.5", status: "Published" },
    { document: "DOC-003", type: "Technical", version: "v3.0", status: "In Review" },
    { document: "DOC-004", type: "Tutorial", version: "v1.0", status: "Draft" },
    { document: "DOC-005", type: "Reference", version: "v2.5", status: "Published" },
  ];

  return (
    <AppShell>
      <ModulePage title="Documentation Engineer" subtitle="Documentation engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
