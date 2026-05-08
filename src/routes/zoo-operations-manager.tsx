import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/zoo-operations-manager")({
  head: () => ({ meta: [{ title: "Zoo Operations Manager — SaaS Vala" }, { name: "description", content: "Zoo operations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: zooData, isLoading, error } = useQuery({
    queryKey: ["zoo-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Zoo Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Zoo Operations Manager" subtitle="Zoo operations management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Zoo Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Animals in Care", value: "350", delta: "+25", up: true },
    { label: "Daily Visitors", value: "2.5K", delta: "+300", up: true },
    { label: "Enclosure Safety", value: "100%", delta: "—", up: true },
    { label: "Species Diversity", value: "85", delta: "+5", up: true },
  ];

  const columns = [
    { key: "exhibit", label: "Zoo Exhibit" },
    { key: "species", label: "Species" },
    { key: "population", label: "Population" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { exhibit: "African Savannah", species: "Lion, Zebra", population: "25", status: "Active" },
    { exhibit: "Asian Forest", species: "Tiger, Elephant", population: "35", status: "Active" },
    { exhibit: "Primate House", species: "Monkey, Ape", population: "45", status: "Active" },
    { exhibit: "Reptile World", species: "Snake, Lizard", population: "30", status: "Active" },
    { exhibit: "Bird Aviary", species: "Parrot, Eagle", population: "40", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Zoo Operations Manager" subtitle="Zoo operations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
