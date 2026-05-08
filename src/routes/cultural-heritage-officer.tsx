import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/cultural-heritage-officer")({
  head: () => ({ meta: [{ title: "Cultural Heritage Officer — SaaS Vala" }, { name: "description", content: "Cultural heritage workspace" }] }),
  component: Page,
});

function Page() {
  const { data: heritageData, isLoading, error } = useQuery({
    queryKey: ["cultural-heritage-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Cultural Heritage Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Cultural Heritage Officer" subtitle="Cultural heritage workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Cultural Heritage Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Heritage Sites", value: "25", delta: "+3", up: true },
    { label: "Preservation", value: "92%", delta: "+2%", up: true },
    { label: "Events Organized", value: "15", delta: "+2", up: true },
    { label: "Visitors", value: "5K", delta: "+500", up: true },
  ];

  const columns = [
    { key: "site", label: "Heritage Site" },
    { key: "type", label: "Type" },
    { key: "condition", label: "Condition" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { site: "SITE-001", type: "Historic", condition: "Good", status: "Protected" },
    { site: "SITE-002", type: "Cultural", condition: "Fair", status: "Protected" },
    { site: "SITE-003", type: "Religious", condition: "Good", status: "Protected" },
    { site: "SITE-004", type: "Natural", condition: "Excellent", status: "Protected" },
    { site: "SITE-005", type: "Archaeological", condition: "Fair", status: "In Review" },
  ];

  return (
    <AppShell>
      <ModulePage title="Cultural Heritage Officer" subtitle="Cultural heritage workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
