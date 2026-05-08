import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/rd-director")({
  head: () => ({ meta: [{ title: "R&D Director — SaaS Vala" }, { name: "description", content: "Research and Development leadership" }] }),
  component: Page,
});

function Page() {
  const { data: rdData, isLoading, error } = useQuery({
    queryKey: ["rd-director-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch R&D Director data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="R&D Director" subtitle="Research and Development leadership" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load R&D Director data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "R&D Projects", value: "18", delta: "+3", up: true },
    { label: "R&D Budget", value: "$2.5M", delta: "+$0.5M", up: true },
    { label: "Patents Granted", value: "5", delta: "+1", up: true },
    { label: "Research Output", value: "12 papers", delta: "+2", up: true },
  ];

  const columns = [
    { key: "project", label: "R&D Project" },
    { key: "budget", label: "Budget" },
    { key: "progress", label: "Progress" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "Advanced AI Models", budget: "$500K", progress: "75%", status: "On Track" },
    { project: "Quantum Computing", budget: "$800K", progress: "30%", status: "Research" },
    { project: "Next-Gen Security", budget: "$400K", progress: "85%", status: "On Track" },
    { project: "Edge Intelligence", budget: "$350K", progress: "60%", status: "In Progress" },
    { project: "Sustainable Tech", budget: "$450K", progress: "45%", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="R&D Director" subtitle="Research and Development leadership" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
