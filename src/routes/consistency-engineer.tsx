import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/consistency-engineer")({
  head: () => ({ meta: [{ title: "Consistency Engineer — SaaS Vala" }, { name: "description", content: "Consistency engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: consistencyData, isLoading, error } = useQuery({
    queryKey: ["consistency-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Consistency Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Consistency Engineer" subtitle="Consistency engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Consistency Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Checks Run", value: "200", delta: "+20", up: true },
    { label: "Consistency Rate", value: "99%", delta: "+0.5%", up: true },
    { label: "Inconsistencies", value: "2", delta: "-1", up: true },
    { label: "Repair Time", value: "5min", delta: "-1min", up: true },
  ];

  const columns = [
    { key: "check", label: "Consistency Check" },
    { key: "type", label: "Type" },
    { key: "data", label: "Data Set" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { check: "CHK-001", type: "CRC", data: "Database", status: "Passed" },
    { check: "CHK-002", type: "Hash", data: "Files", status: "Passed" },
    { check: "CHK-003", type: "Checksum", data: "Cache", status: "Failed" },
    { check: "CHK-004", type: "CRC", data: "Database", status: "Passed" },
    { check: "CHK-005", type: "Hash", data: "Files", status: "Passed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Consistency Engineer" subtitle="Consistency engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
