import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/lineage-analyst")({
  head: () => ({ meta: [{ title: "Lineage Analyst — SaaS Vala" }, { name: "description", content: "Data lineage analysis" }] }),
  component: Page,
});

function Page() {
  const { data: lineageData, isLoading, error } = useQuery({
    queryKey: ["lineage-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Lineage Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Lineage Analyst" subtitle="Data lineage analysis" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Lineage Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Data Flows Mapped", value: "234", delta: "+45", up: true },
    { label: "Lineage Coverage", value: "88%", delta: "+5%", up: true },
    { label: "Dependencies Tracked", value: "45", delta: "+8", up: true },
    { label: "Impact Analysis", value: "98%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "flow", label: "Data Flow" },
    { key: "source", label: "Source" },
    { key: "target", label: "Target" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { flow: "Customer Data Sync", source: "CRM", target: "Data Warehouse", status: "Active" },
    { flow: "Sales Pipeline", source: "ERP", target: "Analytics", status: "Active" },
    { flow: "Product Feed", source: "PIM", target: "Website", status: "Active" },
    { flow: "Inventory Update", source: "Warehouse", target: "ERP", status: "Active" },
    { flow: "Financial Export", source: "Accounting", target: "BI", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Lineage Analyst" subtitle="Data lineage analysis" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
