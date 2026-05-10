// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/sovereign-data-officer")({
  head: () => ({ meta: [{ title: "Sovereign Data Officer — SaaS Vala" }, { name: "description", content: "Sovereign data management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: sovereignData, isLoading, error } = useQuery({
    queryKey: ["sovereign-data-officer-dashboard"],
    queryFn: async () => {
      const response = fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Sovereign Data Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Sovereign Data Officer" subtitle="Sovereign data management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Sovereign Data Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Data Residency", value: "100%", delta: "0%", up: true },
    { label: "Cross-Border Transfers", value: "50", delta: "+5", up: true },
    { label: "Compliance", value: "99%", delta: "+0.5%", up: true },
    { label: "Local Storage", value: "95%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "region", label: "Sovereign Region" },
    { key: "data", label: "Data Volume" },
    { key: "compliance", label: "Compliance" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { region: "REG-001", data: "50TB", compliance: "100%", status: "Compliant" },
    { region: "REG-002", data: "40TB", compliance: "98%", status: "Compliant" },
    { region: "REG-003", data: "30TB", compliance: "100%", status: "Compliant" },
    { region: "REG-004", data: "35TB", compliance: "95%", status: "In Review" },
    { region: "REG-005", data: "25TB", compliance: "100%", status: "Compliant" },
  ];

  return (
    <AppShell>
      <ModulePage title="Sovereign Data Officer" subtitle="Sovereign data management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
