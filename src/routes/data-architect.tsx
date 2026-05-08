import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/data-architect")({
  head: () => ({ meta: [{ title: "Data Architect — SaaS Vala" }, { name: "description", content: "Data architecture workspace" }] }),
  component: Page,
});

function Page() {
  const { data: dataArchData, isLoading, error } = useQuery({
    queryKey: ["data-architect-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Data Architect data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Data Architect" subtitle="Data architecture workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Data Architect data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Data Domains", value: "12", delta: "+2", up: true },
    { label: "Data Quality", value: "94%", delta: "+2%", up: true },
    { label: "Data Volumes", value: "5.2TB", delta: "+0.8TB", up: false },
    { label: "Governance Coverage", value: "88%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "domain", label: "Data Domain" },
    { key: "source", label: "Source" },
    { key: "quality", label: "Quality Score" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { domain: "Customer Data", source: "CRM", quality: "96%", status: "Active" },
    { domain: "Transaction Data", source: "ERP", quality: "98%", status: "Active" },
    { domain: "Product Data", source: "PIM", quality: "92%", status: "Active" },
    { domain: "Analytics Data", source: "Data Lake", quality: "90%", status: "Active" },
    { domain: "Log Data", source: "Applications", quality: "95%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Data Architect" subtitle="Data architecture workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
