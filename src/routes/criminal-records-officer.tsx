import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/criminal-records-officer")({
  head: () => ({ meta: [{ title: "Criminal Records Officer — SaaS Vala" }, { name: "description", content: "Criminal records management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: recordsData, isLoading, error } = useQuery({
    queryKey: ["criminal-records-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Criminal Records Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Criminal Records Officer" subtitle="Criminal records management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Criminal Records Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Records Managed", value: "25K", delta: "+1K", up: true },
    { label: "Requests Processed", value: "350", delta: "+30", up: true },
    { label: "Accuracy", value: "99%", delta: "+0.5%", up: true },
    { label: "Response Time", value: "24h", delta: "-4h", up: true },
  ];

  const columns = [
    { key: "record", label: "Record ID" },
    { key: "type", label: "Type" },
    { key: "date", label: "Last Updated" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { record: "CRIM-001", type: "Felonies", date: "2024-06-15", status: "Active" },
    { record: "CRIM-002", type: "Misdemeanors", date: "2024-06-10", status: "Active" },
    { record: "CRIM-003", type: "Expunged", date: "2024-05-20", status: "Archived" },
    { record: "CRIM-004", type: "Felonies", date: "2024-06-18", status: "Active" },
    { record: "CRIM-005", type: "Misdemeanors", date: "2024-06-12", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Criminal Records Officer" subtitle="Criminal records management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
