import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/content-taxonomy-manager")({
  head: () => ({ meta: [{ title: "Content Taxonomy Manager — SaaS Vala" }, { name: "description", content: "Content taxonomy management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: taxonomyData, isLoading, error } = useQuery({
    queryKey: ["content-taxonomy-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Content Taxonomy Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Content Taxonomy Manager" subtitle="Content taxonomy management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Content Taxonomy Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Taxonomies Managed", value: "25", delta: "+3", up: true },
    { label: "Categories", value: "500", delta: "+50", up: true },
    { label: "Content Classified", value: "95%", delta: "+2%", up: true },
    { label: "Consistency", value: "92%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "taxonomy", label: "Taxonomy" },
    { key: "domain", label: "Domain" },
    { key: "levels", label: "Levels" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { taxonomy: "TAX-001", domain: "Content", levels: "4", status: "Active" },
    { taxonomy: "TAX-002", domain: "Product", levels: "5", status: "Active" },
    { taxonomy: "TAX-003", domain: "User", levels: "3", status: "Active" },
    { taxonomy: "TAX-004", domain: "Document", levels: "6", status: "In Review" },
    { taxonomy: "TAX-005", domain: "Media", levels: "4", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Content Taxonomy Manager" subtitle="Content taxonomy management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
