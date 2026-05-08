import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/public-health-officer")({
  head: () => ({ meta: [{ title: "Public Health Officer — SaaS Vala" }, { name: "description", content: "Public health officer workspace" }] }),
  component: Page,
});

function Page() {
  const { data: publicHealthData, isLoading, error } = useQuery({
    queryKey: ["public-health-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Public Health Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Public Health Officer" subtitle="Public health officer workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Public Health Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Health Programs", value: "18", delta: "+2", up: true },
    { label: "Population Covered", value: "125K", delta: "+5K", up: true },
    { label: "Disease Outbreaks", value: "2", delta: "-1", up: true },
    { label: "Vaccination Rate", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "program", label: "Health Program" },
    { key: "coverage", label: "Coverage" },
    { key: "budget", label: "Budget" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { program: "Immunization Campaign", coverage: "95%", budget: "$1.5M", status: "Active" },
    { program: "Disease Surveillance", coverage: "100%", budget: "$800K", status: "Active" },
    { program: "Health Education", coverage: "75%", budget: "$500K", status: "Active" },
    { program: "Maternal Health", coverage: "85%", budget: "$1.2M", status: "Active" },
    { program: "Nutrition Support", coverage: "70%", budget: "$600K", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Public Health Officer" subtitle="Public health officer workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
