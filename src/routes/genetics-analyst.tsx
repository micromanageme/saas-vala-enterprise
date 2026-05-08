import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/genetics-analyst")({
  head: () => ({ meta: [{ title: "Genetics Analyst — SaaS Vala" }, { name: "description", content: "Genetics analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: geneticsData, isLoading, error } = useQuery({
    queryKey: ["genetics-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Genetics Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Genetics Analyst" subtitle="Genetics analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Genetics Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Samples Analyzed", value: "350", delta: "+40", up: true },
    { label: "Variants Identified", value: "2.5K", delta: "+300", up: true },
    { label: "Reports Generated", value: "85", delta: "+10", up: true },
    { label: "Accuracy", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "sample", label: "Genetic Sample" },
    { key: "type", label: "Type" },
    { key: "variants", label: "Variants" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { sample: "GEN-001", type: "Whole Genome", variants: "50", status: "Analyzed" },
    { sample: "GEN-002", type: "Exome", variants: "30", status: "In Progress" },
    { sample: "GEN-003", type: "Panel", variants: "20", status: "Completed" },
    { sample: "GEN-004", type: "Whole Genome", variants: "45", status: "Analyzed" },
    { sample: "GEN-005", type: "Targeted", variants: "15", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="Genetics Analyst" subtitle="Genetics analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
