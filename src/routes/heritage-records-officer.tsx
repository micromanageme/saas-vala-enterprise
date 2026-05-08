import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/heritage-records-officer")({
  head: () => ({ meta: [{ title: "Heritage Records Officer — SaaS Vala" }, { name: "description", content: "Heritage records management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: recordsData, isLoading, error } = useQuery({
    queryKey: ["heritage-records-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Heritage Records Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Heritage Records Officer" subtitle="Heritage records management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Heritage Records Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Records Managed", value: "8.5K", delta: "+500", up: true },
    { label: "Digitization", value: "75%", delta: "+5%", up: true },
    { label: "Access Requests", value: "125", delta: "+15", up: true },
    { label: "Preservation", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "record", label: "Heritage Record" },
    { key: "type", label: "Type" },
    { key: "year", label: "Year" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { record: "REC-001", type: "Document", year: "1920", status: "Archived" },
    { record: "REC-002", type: "Photo", year: "1950", status: "Digitized" },
    { record: "REC-003", type: "Manuscript", year: "1880", status: "Preserved" },
    { record: "REC-004", type: "Audio", year: "1970", status: "In Process" },
    { record: "REC-005", type: "Video", year: "1990", status: "Digitized" },
  ];

  return (
    <AppShell>
      <ModulePage title="Heritage Records Officer" subtitle="Heritage records management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
