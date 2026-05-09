import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-systemdna")({
  head: () => ({ meta: [{ title: "Root System DNA Registry — Universal Access Admin" }, { name: "description", content: "Complete module genealogy, dependency ancestry mapping, version lineage tracking" }] }),
  component: Page,
});

function Page() {
  const { data: dnaData, isLoading, error } = useQuery({
    queryKey: ["root-systemdna"],
    queryFn: async () => {
      const response = await fetch("/api/root/system-dna-registry?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch system DNA data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root System DNA Registry" subtitle="Complete module genealogy, dependency ancestry mapping, version lineage tracking" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root System DNA Registry data</div>
      </AppShell>
    );
  }

  const data = dnaData?.data;
  const genealogy = data?.moduleGenealogy || [];
  const ancestry = data?.dependencyAncestry;

  const kpis = ancestry ? [
    { label: "Total Modules", value: ancestry.totalModules.toString(), delta: "—", up: true },
    { label: "Mapped Ancestries", value: ancestry.mappedAncestries.toString(), delta: "—", up: true },
    { label: "Total Generations", value: data?.versionLineage?.totalGenerations.toString() || "0", delta: "—", up: true },
  ];

  const columns = [
    { key: "module", label: "Module" },
    { key: "parent", label: "Parent" },
    { key: "generation", label: "Generation" },
    { key: "lineage", label: "Lineage" },
  ];

  const rows = genealogy.map((g: any) => ({
    module: g.module,
    parent: g.parent,
    generation: g.generation.toString(),
    lineage: g.lineage.join(" → "),
  }));

  return (
    <AppShell>
      <ModulePage title="Root System DNA Registry" subtitle="Complete module genealogy, dependency ancestry mapping, version lineage tracking" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
