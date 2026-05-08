import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/tamper-detection-officer")({
  head: () => ({ meta: [{ title: "Tamper Detection Officer — SaaS Vala" }, { name: "description", content: "Tamper detection workspace" }] }),
  component: Page,
});

function Page() {
  const { data: tamperData, isLoading, error } = useQuery({
    queryKey: ["tamper-detection-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Tamper Detection Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Tamper Detection Officer" subtitle="Tamper detection workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Tamper Detection Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Assets Monitored", value: "500", delta: "+50", up: true },
    { label: "Tampering Detected", value: "3", delta: "-1", up: true },
    { label: "False Positives", value: "0.5%", delta: "-0.2%", up: true },
    { label: "Detection Time", value: "5min", delta: "-1min", up: true },
  ];

  const columns = [
    { key: "asset", label: "Monitored Asset" },
    { key: "type", label: "Type" },
    { key: "integrity", label: "Integrity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { asset: "AST-001", type: "Database", integrity: "100%", status: "Secure" },
    { asset: "AST-002", type: "File", integrity: "100%", status: "Secure" },
    { asset: "AST-003", type: "Log", integrity: "98%", status: "Warning" },
    { asset: "AST-004", type: "Database", integrity: "100%", status: "Secure" },
    { asset: "AST-005", type: "File", integrity: "100%", status: "Secure" },
  ];

  return (
    <AppShell>
      <ModulePage title="Tamper Detection Officer" subtitle="Tamper detection workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
